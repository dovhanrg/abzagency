import {User} from "./entity/User";
import {faker} from "@faker-js/faker";
import moment from "moment/moment";
import {AppDataSource} from "./data-source";


const createRandomUser = (): Omit<User, 'id' | 'image_file_name'> => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        city: faker.location.city(),
        country_code: faker.location.countryCode(),
        password: faker.internet.password(),
        created_at: new Date().toISOString(),
        birthday: moment(faker.date.birthdate()).format('YYYYMMDD'),
    }
}
const initUsers = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const oldUsers = await userRepository.find();
    if (oldUsers && oldUsers.length) {
        return;
    }

    const users = new Array(45).fill(null).map(() => createRandomUser());
    await userRepository.save(users);

    console.log('Users have been saved to DB');
}

export default initUsers;
