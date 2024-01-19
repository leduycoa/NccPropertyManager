import { IsEmail, IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
 
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
 
export default RegisterDto;