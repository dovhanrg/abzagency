import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 60,
    })
    first_name: string;

    @Column({
        length: 60,
        nullable: true,
    })
    last_name: string;

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

    @Column()
    position_id: number;

    @Column({ type: "uuid", nullable: true })
    image_file_name: string;

    @Column("timestamp")
    created_at: string;
}