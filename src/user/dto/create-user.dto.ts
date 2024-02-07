import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatusEnum } from '../constants/user.constant';
import { Prisma } from '@prisma/client';
import IsJsonObject from '../../utils/is-json-object.util';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
    message: 'Invalid email address',
  })
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsString()
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status: UserStatusEnum;

  @IsDate()
  @IsOptional()
  inviteSent: Date;
}

export default CreateUserDto;
