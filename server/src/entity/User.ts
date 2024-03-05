import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Position} from "./Position";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        length: 250,
    })
    email: string;

    @Column({
        length: 20,
    })
    password: string;

    @Column({length: 20})
    phone: string;

    @ManyToOne(() => Position, (position) => position.name)
    position: Position;

    @Column({ type: "uuid", nullable: true })
    image_file_name: string;

    @Column("timestamp")
    created_at: string;
}