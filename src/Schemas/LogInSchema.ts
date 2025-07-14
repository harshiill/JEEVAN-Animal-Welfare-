import {z} from 'zod';

export const signInSchema = z.object({
    email : z.string().email({ message: "Please use a valid Email Address" }),
    password : z.string()
})