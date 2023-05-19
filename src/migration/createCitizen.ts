import Citizen, { CitizenDocument } from '../models/citizenSchema';
import Ward from '../models/wardsSchema';

const citizensData: {
    fullName: string;
    gender: string;
    address: string;
    phone: string;
    ward: string;
}[] = [
        {
            fullName: 'Citizen 1',
            gender: 'Male',
            address: 'Address 1',
            phone: '1234567890',
            ward: 'Ward 1',
        },

    ];

export const up = async (): Promise<void> => {
    const citizensPromises: Promise<CitizenDocument>[] = citizensData.map(async (citizenData) => {
        const ward = await Ward.findOne({ name: citizenData.ward });
        return new Citizen({
            fullName: citizenData.fullName,
            gender: citizenData.gender,
            address: citizenData.address,
            phone: citizenData.phone,
            ward: ward?._id,
        });
    });

    const citizens: CitizenDocument[] = await Promise.all(citizensPromises);

    await Citizen.create(citizens);
    console.log('Citizens created successfully.');
};

export const down = async (): Promise<void> => {
    await Citizen.deleteMany({});
    console.log('Citizens deleted successfully.');
};
