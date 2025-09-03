import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateContactDetailsDto } from 'src/modules/users/dto/update-contact-details.dto';
import { UserDocument } from 'src/modules/users/schemas/user.schema';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@GetUser('sub') userId: string) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('contact-details')
  updateContactDetails(
    @GetUser('sub') userId: string,
    @Body() dto: UpdateContactDetailsDto,
  ) {
    const data: Partial<UserDocument> = {
      contactDetails: dto,
      fullName: dto.fullName,
    };
    return this.usersService.update(userId, data);
  }
}
