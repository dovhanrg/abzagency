import express from "express";
import getUsers from "./getUsers";
import postUsers from "./postUsers";

const router = express.Router();

router.get('/users', getUsers);

router.post('/users', postUsers)

export default router;
