import mongoose, { Schema, Document } from 'mongoose';

export enum UserType {
    Admin = 'admin',
    Regular = 'regular',
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    userType: UserType;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userType: { type: String, enum: Object.values(UserType), default: UserType.Regular },
    },
    { timestamps: true }
);

export default mongoose.model<UserDocument>('User', UserSchema);
