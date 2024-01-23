import { IsEmail, IsString, IsNotEmpty, MinLength, IsUUID, IsOptional, IsDate } from 'class-validator';
import { Userstatus, UserType } from '../../user/constants/user.constant';
export class RegisterDto {
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
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  status: Userstatus;

  @IsString()
  @IsOptional()
  type: UserType;

  @IsDate()
  @IsOptional()
  inviteSent: Date
}

export default RegisterDto;