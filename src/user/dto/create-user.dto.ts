import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Userstatus, UserType } from '../constants/user.constant';
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
  @IsEnum(Userstatus)
  @IsOptional()
  status: Userstatus;

  @IsString()
  @IsEnum(UserType)
  @IsOptional()
  type: UserType;

  @IsDate()
  @IsOptional()
  inviteSent: Date;

  @IsJsonObject()
  @IsOptional()
  onboardTracking: Prisma.InputJsonObject;
}

export default CreateUserDto;
