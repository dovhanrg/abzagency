import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Position} from "../entity/Position";

const nameSchema = z.string()
    .min(2, 'Name must be not less than 2 characters')
    .max(20, 'Name must be max of 20 characters');
const uaPhoneNumberRegex = new RegExp(/^\+380(50|99|97|66|93|63|77|67|98)\d{7}$/);

const userSchema = z.object({
    name: nameSchema,
    email: z.string().trim().max(250, 'Max email length is 250 characters').email({message: 'Invalid email address'}),
    phone: z.string().regex(uaPhoneNumberRegex, 'Invalid number. Number must be in format +380000000000'),
    position_id: z.number().positive(),
    password: z.string().min(4).max(20),
    // photo
});

const postUsers = async (req: Request<{}, any, z.infer<typeof userSchema>, {}>, res: Response) => {
    const body = req.body;
    const parsedResult = userSchema.safeParse(body);
    console.log(parsedResult);
    if (!parsedResult.success) {
        res
            .status(422)
            .json({
                success: false,
                message: parsedResult.error.issues[0].message,
                parsedResult,
            });
        return;
    }
    const userRepository = AppDataSource.getRepository(User);
    const isUserWithCredentialsExist = await userRepository.exists({
        where: [
            {email: parsedResult.data.email,},
            {phone: parsedResult.data.phone,},
        ]
    });

    if (isUserWithCredentialsExist) {
        res
            .status(409)
            .json({
                success: false,
                message: "User with this phone or email already exist",
            });
        return;
    }
    const positionRepository = AppDataSource.getRepository(Position);
    const position = await positionRepository.findOne({
        where: {
            id: body.position_id,
        }
    });

    if (!position) {
        res
            .status(404)
            .json({
                success: false,
                message: 'Position not found',
                position_id: body.position_id,
            });
        return;
    }

    const user = new User();
    user.position = position;
    user.email = parsedResult.data.email;
    user.name = parsedResult.data.name;
    user.phone = parsedResult.data.phone;
    user.password = parsedResult.data.password;
    user.created_at = new Date().toISOString();
    // user.image_file_name

    const savedUser = await userRepository.save(user);

    res.json({
        success: true,
        user_id: savedUser.id,
        message: 'New user successfully registered',
        parsedResult,
    });
};

export default postUsers;
