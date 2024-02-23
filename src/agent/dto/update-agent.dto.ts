import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AgentRoleEnum } from '../constant/agent.constant';

export class UpdateAgencyAgentDTO {
  @IsInt()
  agencyId: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password?: string;

  isDeleted?: boolean;
  isActive?: boolean;

  @IsEnum(AgentRoleEnum)
  role: AgentRoleEnum;
}
