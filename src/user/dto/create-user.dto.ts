import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { UserstatusEnum, UserTypeEnum } from '../constants/user.constant';
import { Prisma } from '@prisma/client';
import IsJsonObject from '../../utils/is-json-object.util';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
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
