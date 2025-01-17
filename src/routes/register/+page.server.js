import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

import { lucia } from "$lib/server/auth";
import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";
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
  default: async ( event ) => {
    const registerForm = await superValidate(event.request, zod(schema));

    console.log('login', registerForm);

    
    if (!registerForm.valid) return fail(400, { regForm: registerForm });
    
    
    const email = registerForm.data.email;
    const password = registerForm.data.password;
    
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    
    const userId = generateId(15);
    
    try {
      db.prepare("INSERT INTO user (id, email, password) VALUES(?, ?, ?)").run(
        userId,
        email,
        passwordHash
      );
      
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    } catch (e) {
      
      console.error(e);
      
      if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return fail(400, {
          message: "Username already used"
        });
      }
      return fail(500, {
        message: "An unknown error occurred"
      });
    }
    console.log("Server actions finished");
    return message(registerForm, { text: 'Form "register" posted successfully!' });
    
    return redirect(302, "/");
  }
};

