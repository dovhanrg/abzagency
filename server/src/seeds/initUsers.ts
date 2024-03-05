import {User} from "../entity/User";
import {faker} from "@faker-js/faker";
import {AppDataSource} from "../data-source";
import {Position} from "../entity/Position";


const initUsers = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const isUsersExists = await userRepository.find({take: 1});
    if (isUsersExists && isUsersExists.length) {
        return;
    }
    const positionsRepository = AppDataSource.getRepository(Position);
    const newPositions = new Array(10).fill(null).map(() => {
        const position = new Position();
        position.name = faker.person.jobTitle();
        return position;
    });

    await positionsRepository.save(newPositions);

    const users = new Array(45).fill(null).map((_, index) => {
        const user = new User();
        user.name = faker.person.firstName();
        user.email = faker.internet.email();
        user.password = faker.internet.password();
        user.created_at = new Date().toISOString();
        user.phone = faker.helpers.fromRegExp('38050[0-9]{7}');
        user.position = newPositions[(index % newPositions.length)];

        return user;
    });
    await userRepository.save(users);

    console.log('Users have been saved to DB');
}

export default initUsers;
