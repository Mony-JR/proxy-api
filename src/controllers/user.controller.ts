import { Controller, Route, Post, Get, Body, Put, Path, Delete, Query } from 'tsoa';
import { UserService } from '../services/user-service';
import { UserServicePrams, UserServicetype } from '../services/type';
import { UserRequest } from '../services/s3-type';

@Route("/v1/users")
export class UserController extends Controller {
    private userService: UserService = new UserService();

    @Post("/")
    public async createNewUser(@Body() requestBody:UserRequest): Promise<UserServicetype | null> {
        return this.userService.createUser(requestBody);
    }

    @Get('/{id}')
    public async getUserById(@Path('id') id: string): Promise<UserServicePrams | null> {
        return this.userService.getUserById(id);
    }

    @Put("/{id}")
    public async updateUser(@Path('id') id: string, @Body() requestBody: UserServicePrams): Promise<UserServicetype | null> {
        return this.userService.updateUser(id, requestBody);
    }

    @Get("/")
    public async getUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('ageMin') ageMin?: number,
        @Query('ageMax') ageMax?: number,
        @Query('name') nameUser?: string,
        @Query('sort') sort?: string
    ): Promise<UserServicetype[] | null> {
        return this.userService.getUsers(page, limit,ageMin,ageMax,nameUser,sort)
    }

    @Delete("/{id}")
    public async deleteUser(@Path('id') id: string): Promise<UserServicetype | null> {
        return this.userService.deleteUser(id);
    }
    @Get("/hello/jest")
    public helloJest(): string {
        return "Hello Docker demo! Hello 1111";
    }
    
}
