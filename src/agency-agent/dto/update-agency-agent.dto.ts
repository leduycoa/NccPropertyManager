import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { AgencyAgentRoleEnum } from '../constant/agency-agent.constant';

export class UpdateAgencyAgentDTO {
  @IsUUID()
  agencyId: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  userName?: string;

  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password?: string;

  @IsEnum(AgencyAgentRoleEnum)
  role: AgencyAgentRoleEnum;
}
