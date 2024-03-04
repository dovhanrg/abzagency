import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";

const DEFAULT_COUNT_PARAM = 6;
const DEFAULT_OFFSET_PARAM = 0;

type RequestType = {
    offset?: string;
    page?: string;
    count?: string;
}
const getUsers = async (req: Request<{}, any, {}, RequestType>, res: Response) => {
    const {offset, page, count} = req.query;

    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
        order: {
            created_at: 'ASC',
        },
        skip: Math.max(Number(offset ?? page ?? DEFAULT_OFFSET_PARAM), DEFAULT_OFFSET_PARAM),
        take: Math.max(Number(count ?? DEFAULT_COUNT_PARAM), DEFAULT_COUNT_PARAM),
        relations: ['position'],
    })
        .then((usersArray) => usersArray.map((user) => {
            const {position, ...rest} = user;
            return {
                ...rest,
                position_id: position.id,
                position: position.name,
            };
        }));

    res.json({success: true, users});
};

export default getUsers;
