import {z} from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
  })

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(zod(schema));

    return { form };
};


export const actions = {
	default: async ({ request }) => {
		const loginForm = await superValidate(request, zod(schema));

		console.log('login', loginForm);

		if (!loginForm.valid) return fail(400, { regForm: loginForm });

		return message(loginForm, { text: 'Form "login" posted successfully!' });
	}
};
