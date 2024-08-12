import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';
import { TestUser, TestUserModel } from '../Models/testUser';

describe('TestController Tests', () => {
    let getID: string;

    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect('mongodb+srv://mony:8tuL6c4irbVNCYdg@cluster0.7r2ktrw.mongodb.net/testjest');
        console.log("Successfully connected to MongoDB");
    });

    afterAll(async () => {
        // Clean up database
        if (getID) {
            await request(app).delete(`/v1/users/${getID}`);
            console.log("User deleted successfully");
        }
        await mongoose.connection.close(); // Close the database connection after all tests
    });

    jest.setTimeout(10000); // Set a timeout for the tests

    it('should return user data for valid ID', async () => {
        const newUser = new TestUserModel({
            name: 'John Doe',
            email: 'john.doe@example.com',
            file: 'https://example.com/file.jpg'
        });

        console.log('New user before save:', newUser); // Log new user before save

        const savedUser = await newUser.save() as TestUser;
        console.log('Saved user:', savedUser);  // Log the saved user

        const response = await request(app).get(`/v1/users/${savedUser._id}`).expect(200);
        console.log('Response body:', response.body);  // Log the response body

        expect(response.body).toEqual({
            _id: savedUser._id.toString(),
            name: 'John Doe',
            email: 'john.doe@example.com',
            file: 'https://example.com/file.jpg',
            __v: 0
        });

        getID = savedUser._id.toString(); // Store the ID for cleanup
    });

    it('should return all user data', async () => {
        const newUser = new TestUserModel({
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg'
        });
        const savedUser = await newUser.save();
  
        const response = await request(app).get('/v1/users').expect(200);
        expect(response.body).toContainEqual({
            _id: savedUser._id.toString(),
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg',
            __v: 0,
        });
  
        await TestUserModel.findByIdAndDelete(savedUser._id);
    });
  
  
    it('should create a new user', async () => {
        const newUser ={
            name: 'a',
            email: 'mony@gamail.com',
            file:"file"
        };
  
        const response = await request(app)
            .post('/v1/users')
            .send(newUser)
            .expect(200); // Change to 201 if your API should return 201 for successful creation
  
        // Assert the response body matches the created user data
        expect(response.body).toMatchObject(newUser)
        getID = response.body._id; // Store the ID for further tests
    });
  
  
  
    it('should return delete user data for valid ID', async () => {
        const newUser = new TestUserModel({
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg',
        });
        const savedUser = await newUser.save();
  
        const response = await request(app).delete(`/v1/users/${savedUser._id}`).expect(200);
        expect(response.body).toEqual({
            _id: savedUser._id.toString(),
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg',
            __v: 0,
        });
  
        await TestUserModel.findByIdAndDelete(savedUser._id);
    });
  
  
  
    it('should return Put user data for valid ID', async () => {
        const newUser = new TestUserModel({
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg',
        });
        const savedUser = await newUser.save();
  
        const response = await request(app).put(`/v1/users/${savedUser._id}`).expect(200);
        expect(response.body).toEqual({
            _id: savedUser._id.toString(),
            name: 'a',
            email: 'mony@gamail.com',
            file: 'https://example.com/file.jpg',
            __v: 0,
        });
  
        await TestUserModel.findByIdAndDelete(savedUser._id);
    });
  
  
});
