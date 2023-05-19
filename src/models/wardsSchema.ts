import mongoose, { Schema, Document } from 'mongoose';

export interface WardDocument extends Document {
    name: string;
    lga: string;
    createdAt: Date;
    updatedAt: Date;
}

const WardSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        lga: { type: Schema.Types.ObjectId, ref: 'LGA' },
    },
    { timestamps: true }
);

export default mongoose.model<WardDocument>('Ward', WardSchema);