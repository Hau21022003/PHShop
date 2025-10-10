import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGO_URI,
  // uri: process.env.MONGO_URI || 'mongodb://localhost:27017/PHShop',
  // uri: `mongodb+srv://lephuchau21022003_db_user:KrO7zP9GKRv1qzuD@cluster0.82oa4eu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
};
