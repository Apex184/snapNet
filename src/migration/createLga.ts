import LGA, { LGADocument } from '../models/lgaSchema';
import State from '../models/stateSchema';

const lgasData: { name: string; state: string }[] = [
    { name: 'LGA 1', state: 'State 1' },
    { name: 'LGA 2', state: 'State 2' },
    { name: 'LGA 3', state: 'State 3' },
    { name: 'LGA 4', state: 'State 4' },
    { name: 'LGA 5', state: 'State 5' },
];

export const up = async (): Promise<void> => {
    const lgasPromises: Promise<LGADocument>[] = lgasData.map(async (lgaData) => {
        const state = await State.findOne({ name: lgaData.state });
        return new LGA({
            name: lgaData.name,
            state: state?._id,
        });
    });

    const lgas: LGADocument[] = await Promise.all(lgasPromises);

    await LGA.create(lgas);
    console.log('LGAs created successfully.');
};

export const down = async (): Promise<void> => {
    await LGA.deleteMany({});
    console.log('LGAs deleted successfully.');
};
