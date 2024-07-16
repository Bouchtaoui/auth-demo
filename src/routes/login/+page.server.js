import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { lucia } from "$lib/server/auth";
import { generateId } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { SqliteError } from "better-sqlite3";
import { db } from "$lib/server/db";


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
})

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    if (event.locals.user) {
        return redirect(302, "/");
    }

    const form = await superValidate(zod(schema));

    return { form };
};


/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event) => {
        const registerForm = await superValidate(event.request, zod(schema));

        console.log('login', registerForm);

        if (!registerForm.valid) return fail(400, { regForm: registerForm });

        const email = registerForm.data.email;
        const password = registerForm.data.password;

        try {
            /** @type {import('$lib/server/db').DatabaseUser|undefined} */
            const existingUser = /** @type {import('$lib/server/db').DatabaseUser|undefined} */ (db.prepare("SELECT * FROM user WHERE email = ?").get(email));

            console.log('existingUser', existingUser);

            if (!existingUser) {
                return fail(400, {
                    message: "Incorrect username or password"
                });
            }

            const validPassword = await verify(existingUser.password, password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });
            if (!validPassword) {
                // NOTE:
                // Returning immediately allows malicious actors to figure out valid usernames from response times,
                // allowing them to only focus on guessing passwords in brute-force attacks.
                // As a preventive measure, you may want to hash passwords even for invalid usernames.
                // However, valid usernames can be already be revealed with the signup page among other methods.
                // It will also be much more resource intensive.
                // Since protecting against this is non-trivial,
                // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
                // If usernames are public, you can outright tell the user that the username is invalid.
                return fail(400, {
                    message: "Incorrect username or password"
                });
            }

            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
        } catch (e) {

            console.error(e);

            return fail(500, {
                message: "An unknown error occurred"
            });
        }
        console.log("Server actions finished");

        return redirect(302, "/");
    }
};

