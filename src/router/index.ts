import express from "express";
import getUsers from "./getUsers";
import postUsers from "./postUsers";
import getUser from "./getUser";
import getPositions from "./getPositions";

const router = express.Router();

router.get('/users/:id', getUser);

router.get('/users', getUsers);

router.post('/users', postUsers);

router.get('/positions', getPositions);

export default router;
