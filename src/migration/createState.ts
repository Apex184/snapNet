import State, { StateDocument } from '../models/stateSchema';

const statesData: string[] = ['State 1', 'State 2', 'State 3', 'State 4', 'State 5'];

export const up = async (): Promise<void> => {
    const states: StateDocument[] = statesData.map((stateName) => new State({ name: stateName }));

    await State.create(states);
    console.log('States created successfully.');
};

export const down = async (): Promise<void> => {
    await State.deleteMany({});
    console.log('States deleted successfully.');
};
