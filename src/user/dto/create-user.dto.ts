import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserstatusEnum, UserTypeEnum } from '../constants/user.constant';
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
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsEnum(UserstatusEnum)
  @IsOptional()
  status: UserstatusEnum;

  @IsString()
  @IsEnum(UserTypeEnum)
  @IsOptional()
  type: UserTypeEnum;

  @IsDate()
  @IsOptional()
  inviteSent: Date;

  @IsJsonObject()
  @IsOptional()
  onboardTracking: Prisma.InputJsonObject;
}

export default CreateUserDto;
