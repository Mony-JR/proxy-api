import  { Schema, model } from 'mongoose';


interface IUser {
    name?: string;
    email?: string;
    file?: string; // URL of the uploaded file
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    file: { type: String, required: true }
});

export const UserModelUpdate = model<IUser>('User', UserSchema);
