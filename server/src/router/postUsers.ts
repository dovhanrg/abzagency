import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Position} from "../entity/Position";
import {Token} from "../entity/Token";
import moment from "moment/moment";
import services from '../services'


const postUsers = async (req: Request<{}, any, z.infer<typeof services.validatorService.userSchema>, {}>, res: Response) => {
    if (!req.file) {
        res.status(422).json({success: false, message: 'Image with extension jpg or jpeg is mandatory'});
        return;
    }
    const token = req.headers['token'] as string;
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'The token is mandatory.',
        });
        return;
    }
    const tokenRepository = AppDataSource.getRepository(Token);

    const isTokenExists = await tokenRepository.findOne({
        where: {
            token: token,
        }
    });

    if (!isTokenExists || !moment(isTokenExists.created_at).add(40, "m").isAfter(new Date().toISOString())) {
        res.status(401).json({
            success: false,
            message: 'The token expired',
        });
        return;
    }

    const body = req.body;
    const parsedResult = services.validatorService.postUsersValidator(body);

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

    await services.imageResizerService(req.file.filename);

    const user = new User();
    user.position = position;
    user.email = parsedResult.data.email;
    user.name = parsedResult.data.name;
    user.phone = parsedResult.data.phone;
    user.password = parsedResult.data.password;
    user.created_at = new Date().toISOString();
    user.image_file_name = req.file.filename;

    const savedUser = await userRepository.save(user);

    res.json({
        success: true,
        user_id: savedUser.id,
        message: 'New user successfully registered',
        parsedResult,
    });
};

export default postUsers;
