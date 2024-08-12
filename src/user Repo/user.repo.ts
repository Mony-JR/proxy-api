// src/services/userService.ts

import { User, UserModel, UserCreationParams } from "../Models/user";

export class UserRepo {
    async getUserById(id: string): Promise<User | null> {
        return UserModel.findById(id).exec();
    }

    async getUsers(page?: number, limit?: number, ageMin?: number, ageMax?: number,nameUser?:string,sort?:string): Promise<User[] | null> {

        console.log("AGE ===== ", ageMax)

        if (page) {
            console.log(page);

            if (page !== undefined && limit !== undefined) {
                const skip = (page - 1) * limit;
                return await UserModel.find().skip(skip).limit(limit).exec();
            } else if (page === undefined && limit === undefined) {
                return await UserModel.find().exec();
            }
        } if (ageMin) {
            console.log("AGE ===== ", ageMin)
            if (ageMin !== undefined && ageMax !== undefined) {
                return await UserModel.find({ age: { $gte: ageMin, $lte: ageMax } }).exec();

            } else {
                console.log("E LSE");
                return await UserModel.find().exec();
            }
        } 
        if(sort){
            if(sort === "a-z"){
                return await UserModel.find().sort({name:1}).exec();
            }else if(sort === "z-a"){
                return await UserModel.find().sort({name:-1}).exec();
            }else{
                return await UserModel.find().exec();
            }
        }

        if(nameUser){
            if(nameUser!==undefined){
                return await UserModel.find({ name: new RegExp(nameUser, "i") }).exec();
            }
            else{
                return await UserModel.find().exec();
            }
        }else {
            return await UserModel.find().exec();
        }


    }

    async createUser(userCreationParams: UserCreationParams): Promise<User | null> {
        const newUser = new UserModel(userCreationParams);
        return newUser.save();
    }

    async updateUser(id: string, userDetails: UserCreationParams): Promise<User | null> {
        return UserModel.findByIdAndUpdate(id, userDetails, { new: true }).exec();
    }

    async deleteUser(id: string): Promise<User | null> {
        return UserModel.findByIdAndDelete(id).exec();
    }
}
