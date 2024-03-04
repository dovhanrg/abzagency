import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
    })
    first_name: string;

    @Column({
        length: 20,
    })
    last_name: string;

    @Column("date", {nullable: true})
    birthday: string;

    @Column({
        length: 50,
    })
    email: string;

    @Column({
        length: 20,
    })
    password: string;

    @Column({
        length: 100,
        nullable: true,
    })
    city: string;

    @Column({
        length: 2,
        nullable: true,
    })
    country_code: string;

    @Column({ type: "uuid", nullable: true })
    image_file_name: string;

    @Column("timestamp")
    created_at: string;
}