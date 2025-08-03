import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const created = new this.userModel(createUserDto);
    return created.save();
  }

  async findAll() {
    const result = await this.userModel.find().exec();
    // return result.map((doc) => doc.toObject());
    return result.map((doc) => ({
      ...doc.toObject(),
      _id: doc._id.toString(),
    }));
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  async update(id: string, updateData: Partial<User>) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
