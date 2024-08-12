import { Controller, Route, UploadedFile, Post, FormField, Put, Path, Tags } from "tsoa";
import { S3Service } from "../services/s3-service";
import { UserRequest } from "../services/s3-type";
// import { UserRequest } from "../services/s3-type";

@Route('v2/upload')
@Tags('S3 upload')
export class UploadController extends Controller {
    private s3Service = new S3Service();

    @Post("/")
    public async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @FormField() name: string,
        @FormField() email: string,
    ): Promise<UserRequest|null> {

        try {
            const user = await this.s3Service.createUpload(file,name,email);
            return user;
        } catch (err) {
            console.error('Error uploading file:', err);
            throw new Error('Error uploading file.');
        }
    }
    @Put("/{id}")
    public async updateFile(
        @Path('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @FormField() name: string,
        @FormField() email: string,
    ): Promise<UserRequest|null> {
        try {
            const user = await this.s3Service.updateUpload(id, file, name, email);
            return user;
        } catch (err) {
            console.error('Error updating file:', err);
            throw new Error('Error updating file.');
        }
    }

    @Put('update/{id}')
    public async delelteFile(
        @Path('id') id:string,
    ):Promise<UserRequest |null>{
        try {
            const user = await this.s3Service.deleteUpload(id);
            return user;
        } catch (err) {
            console.error('Error deleting file:', err);
            throw new Error('Error deleting file.');
        }
    }


}
