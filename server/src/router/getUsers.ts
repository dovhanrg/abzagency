import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {getNextPageUrl, getPhotoSrc, getPrevPageUrl, getTotalPages} from "../helpers";

export const DEFAULT_COUNT_PARAM = 6;
export const DEFAULT_OFFSET_PARAM = 0;

type RequestType = {
    offset?: string;
    page?: string;
    count?: string;
}
const getUsers = async (req: Request<{}, any, {}, RequestType>, res: Response) => {
    const {offset, page, count} = req.query;

    const userRepository = AppDataSource.getRepository(User);

    const totalUsers = await userRepository.count();

    console.log(totalUsers);

    const skip = !Number.isNaN(Number(offset))
        ? Number(offset) : (Number(page ?? DEFAULT_OFFSET_PARAM) * Number(count ?? DEFAULT_COUNT_PARAM));

    const users = await userRepository.find({
        select: ['id', 'phone', 'name', 'email', 'image_file_name', 'created_at'],
        order: {
            created_at: 'ASC',
        },
        skip: skip,
        take: Number(count ?? DEFAULT_COUNT_PARAM),
        relations: ['position'],
    })
        .then((usersArray) => usersArray.map((user) => {
            const {position, image_file_name, ...rest} = user;
            return {
                ...rest,
                photo: getPhotoSrc(image_file_name),
                position_id: position.id,
                position: position.name,
            };
        }));

    const response = {
        page,
        total_users: totalUsers,
        total_pages: getTotalPages(totalUsers, count).totalPages,
        count: Number(count) ?? DEFAULT_COUNT_PARAM,
        links: {
            next_url: getNextPageUrl(totalUsers, page, count),
            prev_url: getPrevPageUrl(page, count),
        },
        users,
    }

    res.json({success: true, ...response});
};

export default getUsers;
