import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Userstatus, UserType } from '../constants/userConstant';
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
  @IsNotEmpty()
  status: Userstatus;

  @IsString()
  @IsNotEmpty()
  type: UserType;

  @IsDate()
  @IsOptional()
  inviteSent: Date

}

export default CreateUserDto;
