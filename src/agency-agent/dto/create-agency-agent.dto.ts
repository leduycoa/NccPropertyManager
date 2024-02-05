import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AgencyAgentRoleEnum } from '../constant/agency-agent.constant';
import { Type } from 'class-transformer';

export class CreateAgencyAgentDTO {
  @IsOptional()
  @IsUUID()
  agencyId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, {
    message: 'Invalid email address',
  })
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsEnum(AgencyAgentRoleEnum)
  role: AgencyAgentRoleEnum;
}

export class CreateAgencyAgentListDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateAgencyAgentDTO)
  agents: CreateAgencyAgentDTO[];
}
