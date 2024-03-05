import {Request, Response} from "express";
import {randomUUID} from "node:crypto";
import {AppDataSource} from "../data-source";
import {Token} from "../entity/Token";

const getToken = async (_: Request, res: Response) => {
    const uuid = randomUUID();

    const tokenRepository = AppDataSource.getRepository(Token);

    const token = new Token();
    token.token = uuid;
    token.created_at = new Date().toISOString();

    const newToken = await tokenRepository.save(token);

    res.json({
        success: true,
        token: newToken.token,
    });
}

export default getToken;
