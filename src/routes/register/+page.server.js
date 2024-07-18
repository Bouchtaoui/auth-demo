import {z} from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { signupSchema } from '$lib/server/zods/signupSchema';
import { createUserHandler } from '$lib/server/auth/registerUser';
// import { authGuard } from '$lib/authGuard/authGuardConfig';


/** @type {import('./$types').PageServerLoad} */
export async function load() {

	console.log("server - load()");

    const form = await superValidate(zod(signupSchema));

    return { form };
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		// const registerForm = await superValidate(request, zod(schema));

		// console.log('login', registerForm);

		// if (!registerForm.valid) return fail(400, { regForm: registerForm });

		// return message(registerForm, { text: 'Form "register" posted successfully!' });

		console.log("server - actions()");

		return createUserHandler({ request, admin: false, setSession: false, cookies });
	}
};
