import { $Enums, Agent } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AgentResponseDTO {
  id: number;
  companyId: number;

  ssignPortfolioCount: number;
  isDeleted: boolean;
  isActive: boolean;
  role: $Enums.AgencyAgentType;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
