// src/models/TestUser.ts
import { Schema, model, models } from 'mongoose';

export interface TestUser {
  _id: any;
  name: string;
  email: string;
  age?: number; // Optional age field for testing
  file: number; // Optional age field for testing
}

const testUserSchema = new Schema<TestUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required:true}, // Optional age field in the schema
  file: { type: Number, required:true}, // Optional age field in the schema
});

export const TestUserModel = models.User || model<TestUser>('testuser', testUserSchema);
