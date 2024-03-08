import "reflect-metadata"
import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Position} from "./entity/Position";
import {Token} from "./entity/Token";
import {database, dbHost, dbPort, dbUsername, dbUserPassword} from "./consts";


console.log('process.env', process.env);
export const AppDataSource = new DataSource({
    type: "mysql",
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbUserPassword,
    database: database,
    synchronize: true,
    logging: true,
    entities: [User, Position, Token],
    subscribers: [],
    migrations: [],
});

