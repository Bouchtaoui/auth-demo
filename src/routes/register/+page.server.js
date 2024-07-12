import {z} from 'zod';
import { superValidate } from 'sveltekit-superforms';


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(3)
  })

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const form = await superValidate(schema);

    return { form };
};


export const actions = {
	default: async ({ cookies, request }) => {
		
        // super
	}
};