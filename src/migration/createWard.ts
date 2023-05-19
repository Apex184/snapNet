import Ward, { WardDocument } from '../models/wardsSchema';
import LGA from '../models/lgaSchema';

interface WardData {
    name: string;
    lga: string;
}

const wardsData: WardData[] = [
    { name: 'Ward 1', lga: 'LGA 1' },
    { name: 'Ward 2', lga: 'LGA 2' },
    { name: 'Ward 3', lga: 'LGA 3' },
    { name: 'Ward 4', lga: 'LGA 4' },
    { name: 'Ward 5', lga: 'LGA 5' },
];

export const up = async (): Promise<void> => {
    const wardsPromises: Promise<WardDocument>[] = wardsData.map(async (wardData) => {
        const lga = await LGA.findOne({ name: wardData.lga });
        return new Ward({
            name: wardData.name,
            lga: lga?._id,
        });
    });

    const wards: WardDocument[] = await Promise.all(wardsPromises);

    await Ward.create(wards);
    console.log('Wards created successfully.');
};

export const down = async (): Promise<void> => {
    await Ward.deleteMany({});
    console.log('Wards deleted successfully.');
};
