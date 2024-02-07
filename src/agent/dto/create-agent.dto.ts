import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AgentRoleEnum } from '../constant/agent.constant';
import { Type } from 'class-transformer';

export class CreateAgentDTO {
  @IsOptional()
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsInt()
  userId: number;

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
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsEnum(AgentRoleEnum)
  role: AgentRoleEnum;
}

export class CreateAgentListDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateAgentDTO)
  agents: CreateAgentDTO[];
}
