
import { Schema, model } from 'mongoose';

export interface UserServicetype   {
    name: string;
    email: string;
    age?: number; // Optional age field for testing
}

const UserSchema = new Schema<UserServicetype>({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

export const UserModel = model<UserServicetype>('User', UserSchema);

export interface UserServicePrams {
    name?: string;
    email?: string;
    
}


