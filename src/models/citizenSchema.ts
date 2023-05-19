import mongoose, { Schema, Document } from 'mongoose';

export interface CitizenDocument extends Document {
    fullName: string;
    gender: string;
    address: string;
    phone: string;
    ward: string;
    createdAt: Date;
    updatedAt: Date;
}

const CitizenSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        gender: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        ward: { type: Schema.Types.ObjectId, ref: 'Ward'},
    },
    { timestamps: true }
);

export default mongoose.model<CitizenDocument>('Citizen', CitizenSchema);