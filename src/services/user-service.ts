// src/services/userService.ts

import { UserCreationParams } from "../Models/user";
import { UserRepo } from "../user Repo/user.repo";
import { UserServicePrams } from "./type";

export class UserService extends UserRepo  {
    private useReop= new UserRepo();
    async getUserById(id: string): Promise<any | null> {
        return this.useReop.getUserById(id)
    }

    async getUsers(page?:number,limit?:number,ageMin?:number,ageMax?:number,nameUser?:string,sort?:string): Promise<any|null> {
        return this.useReop.getUsers(page,limit,ageMin,ageMax,nameUser,sort)
    }

    async createUser(userCreationParams: UserCreationParams): Promise<any|null> {
        const newUser = this.useReop.createUser(userCreationParams);
        return newUser;
    }

    async updateUser(id: string, userDetails: UserServicePrams): Promise<any | null> {
        return this.useReop.updateUser(id,userDetails);
    }

    async deleteUser(id: string): Promise<any | null> {
        return this.useReop.deleteUser(id);
    }
}
