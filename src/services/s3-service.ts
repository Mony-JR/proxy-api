import {  DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3Repo } from '../user Repo/s3.repo';
import { UserRequest } from './s3-type';
import config from '../config';
import { UserModel } from '../Models/user';



const s3 = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.keyId,
        secretAccessKey: config.keySecret,
    }
});

export class S3Service {

    private s3_send = new s3Repo();

    public async createUpload(file: Express.Multer.File, name: string, email: string): Promise<UserRequest | null> {
        const fileName = Date.now().toString() + "_" + file.originalname;
        const params = {
            Bucket: "my-testing-monny",
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype // Use the actual MIME type
        };

        try {
            await s3.send(new PutObjectCommand(params));
            const fileUrl = `https://my-testing-monny.s3.amazonaws.com/${fileName}`;

            const userData: UserRequest = {
                name: name,
                email: email,  // assuming email is a required field in your schema. If not, add a check in the repo method.
                file: fileUrl
            };
            console.log(name);
            console.log(email);
            console.log(fileUrl);
            return this.s3_send.createUpload(userData);



        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw new Error('Error uploading to S3.');
        }
    }

    public async updateUpload(id: string, file: Express.Multer.File, name: string, email: string): Promise<UserRequest | null> {
        const fileName = Date.now().toString() + "_" + file.originalname;
        const params = {
            Bucket: "my-testing-monny",
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype // Use the actual MIME type
        };

        try {
            await s3.send(new PutObjectCommand(params));
            const fileUrl = `https://my-testing-monny.s3.amazonaws.com/${fileName}`;

            const updatedUserData: UserRequest = {
                name: name,
                email: email,
                file: fileUrl
            };

            console.log(`Updating user with ID: ${id}`);
            console.log(name);
            console.log(email);
            console.log(fileUrl);

            return this.s3_send.updateUpload(id, updatedUserData);
        } catch (error) {
            console.error('Error updating file in S3:', error);
            throw new Error('Error updating file in S3.');
        }
    }

    
    public async deleteUpload(id: string): Promise<UserRequest|null> {
        console.log(`Finding user with ID: ${id}`); // Log the ID

        try {
            const user = await UserModel.findById(id);
            if (!user) {
                console.log('User not found');
                return { success: false, message: 'User not found' };
            }
            const fileName = user.file;
            if (!fileName) {
                console.log('No file to delete');
                return { success: false, message: 'No file found for deletion' };
            }
    
            const splitURL = fileName.split('/');
            const getnewName = splitURL[3];
            console.log('User file name:', getnewName);
    
    
            const params = {
                Bucket: 'my-testing-monny', // Replace with your bucket name
                Key: getnewName
            };
    
            await s3.send( new DeleteObjectCommand(params));
            console.log('File deleted from S3 successfully');

            const updatedUserData: UserRequest = {
                name: user.name,
                email: user.email,
                file: ""
            }

            return UserModel.findByIdAndUpdate(id, updatedUserData, { new: true }).exec();

            
        } catch (error) {
            console.error('Error updating user name:', error);
            return { success: false, message: 'Error updating user name' };
        }
    }


}
