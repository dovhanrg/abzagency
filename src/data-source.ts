import "reflect-metadata"
import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Position} from "./entity/Position";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "admin",
    database: "abz-agency",
    synchronize: true,
    logging: true,
    entities: [User, Position],
    subscribers: [],
    migrations: [],
});

