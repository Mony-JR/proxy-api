
import { Schema, model } from 'mongoose';

export interface BodyRequest_S3 {
    name?: string;
    email?: string;
    file?: Express.Multer.File;
}


const UserSchema = new Schema<BodyRequest_S3>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    file: { type: String, required: true }
});

export const UserModel_S3 = model<BodyRequest_S3>('User', UserSchema);

export interface UserRequest {
    name?: string;
    email?: string;
    file?: string; // URL of the uploaded file
    message?:string;
    success?: boolean;
}

