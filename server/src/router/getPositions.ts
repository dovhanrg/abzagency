import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Position} from "../entity/Position";


const getPositions = async (req: Request, res: Response) => {
    const positionsRepository = AppDataSource.getRepository(Position);
    const positions = await positionsRepository.find();

    return res.json({
        success: true,
        positions,
    });
};

export default getPositions;
