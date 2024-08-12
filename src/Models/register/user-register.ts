import { model, Schema } from "mongoose";


export interface typeRegister{
    name: string;
    email: string;
    password: string;

}

const userRegisterReq =new Schema<typeRegister>(
    {
        email: { type: String, required: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    }
)

const userRegister=model<typeRegister>('register',userRegisterReq)

export default userRegister

export interface RegisterReq{
    email?: string;
    name?: string;
    password?: string;
}

export interface LoginReq{
    email:string;
    password:string
}