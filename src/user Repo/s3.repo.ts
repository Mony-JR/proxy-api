
import { UserModel } from "../Models/user";
import {  UserRequest } from "../services/s3-type";

export class s3Repo {

    async createUpload(data:UserRequest):Promise<UserRequest|null>{
        
        const newUser = new UserModel(data);
        return newUser.save();
    
    }

    // async createUser(userCreationParams: UserCreationParams): Promise<User | null> {
    //     const newUser = new UserModel(userCreationParams);
    //     return newUser.save();
    // }


    public async updateUpload(id: string, updatedUserData: UserRequest): Promise<UserRequest | null> {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }

            user.file = updatedUserData.file;

            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user.');
        }
    }

}