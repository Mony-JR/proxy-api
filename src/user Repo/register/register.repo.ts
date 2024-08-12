import  { RegisterReq, typeRegister } from "../../Models/register/user-register";


export class RegisterRepo{
    async CreateRegister(_data:RegisterReq):Promise<typeRegister|null>{
        
        return null
    }
}