import {z} from "zod";


const nameSchema = z.string()
    .min(2, 'Name must be not less than 2 characters')
    .max(20, 'Name must be max of 20 characters');
const uaPhoneNumberRegex = new RegExp(/^\+380(50|99|97|66|93|63|77|67|98)\d{7}$/);

export const userSchema = z.object({
    name: nameSchema,
    email: z.string().trim().max(250, 'Max email length is 250 characters').email({message: 'Invalid email address'}),
    phone: z.string().regex(uaPhoneNumberRegex, 'Invalid number. Number must be in format +380000000000'),
    position_id: z.number().positive(),
    password: z.string().min(4).max(20),
});

export const postUsersValidator = (body: z.infer<typeof userSchema>) => {
    return userSchema.safeParse(body);
}