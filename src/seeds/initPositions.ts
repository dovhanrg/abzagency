import {AppDataSource} from "../data-source";
import {Position} from "../entity/Position";
import {faker} from "@faker-js/faker";


const initPositions = async () => {
    const positionsRepository = AppDataSource.getRepository(Position);
    const positions = await positionsRepository.find();
    if (positions && positions.length) return;

    const newPositions: Omit<Position, 'id'>[] = new Array(10).fill(null).map(() => ({
        name: faker.person.jobTitle(),
    }));

    await positionsRepository.save(newPositions);

    await positionsRepository.find();

    console.log('Positions have been saved to DB');
};

export default initPositions;
