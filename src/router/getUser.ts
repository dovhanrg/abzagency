import {Request, Response} from "express";
import {z} from 'zod';
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";

const schema = z.number({
    required_error: 'The user_id is required',
    invalid_type_error: 'The user_id must be an integer',
});


const getUser = async (req: Request<{ id: string }, any, {}, {}>, res: Response) => {
    const {id} = req.params;
    const parseResult = schema.safeParse(Number(id));
    if (!parseResult.success) {
        res.status(422).json({
            success: false,
            message: 'Validation failed',
            fails: {
                'user_id': parseResult.error.issues[0].message,
            }
        })
        return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: {
            id: parseResult.data,
        },
        relations: {
            position: true,
        }
    });

    if (!user) {
        res.status(404).json({success: false, message: 'User not found'});
        return;
    }

    res.json({
        success: true, user: {
            ...user,
            position_id: user.position.id,
            position: user.position.name,
        }
    });
};

export default getUser;
