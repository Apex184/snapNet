import mongoose, { Schema, Document } from 'mongoose';

export interface LGADocument extends Document {
    name: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}

const LGASchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        state: { type: Schema.Types.ObjectId, ref: 'State' },
    },
    { timestamps: true }
);

export default mongoose.model<LGADocument>('LGA', LGASchema);