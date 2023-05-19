import mongoose, { Schema, Document } from 'mongoose';

export interface StateDocument extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const StateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<StateDocument>('State', StateSchema);