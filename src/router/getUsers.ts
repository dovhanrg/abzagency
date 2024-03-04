import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";

const getUsers = async (req: Request, res: Response) => {
    const users = await AppDataSource.manager.find(User);
    res.json({success: true, users});
};

export default getUsers;
