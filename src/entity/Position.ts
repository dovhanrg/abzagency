import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Position {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;
}