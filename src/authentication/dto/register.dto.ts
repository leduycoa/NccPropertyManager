import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';
import {
  UserstatusEnum,
  UserTypeEnum,
} from '../../user/constants/user.constant';
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
  status: UserstatusEnum;

  @IsString()
  @IsOptional()
  type: UserTypeEnum;

  @IsDate()
  @IsOptional()
  inviteSent: Date;
}

export default RegisterDto;
