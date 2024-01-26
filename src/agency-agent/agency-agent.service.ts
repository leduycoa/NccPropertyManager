import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyAgentOwnerDTO } from './dto/create-agency-agent-owner.dto';
import { Prisma } from '@prisma/client';
import { UserTypeEnum, UserstatusEnum } from 'src/user/constants/user.constant';
import { AgencyAgentTypeEnum } from './constant/agency-agent.constant';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AgencyAgentService {
  private readonly logger = new Logger(AgencyAgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createAgencyAgentOwner(agencyAgentDTO: CreateAgencyAgentOwnerDTO) {
    const userData: Prisma.UserCreateInput = {
      firstName: agencyAgentDTO.firstName,
      lastName: agencyAgentDTO.lastName,
      email: agencyAgentDTO.email,
      password: agencyAgentDTO.password,
      phoneNumber: agencyAgentDTO.phoneNumber,
      status: UserstatusEnum.ACTIVE,
      type: UserTypeEnum.AGENT,
    };

    const user = await this.userService.createUser(userData);

    const agentData: Prisma.AgencyAgentCreateManyInput = {
      agencyId: agencyAgentDTO.agencyId,
      userId: user.id,
      role: AgencyAgentTypeEnum.OWNER,
      isActive: true,
      portfolioCount: agencyAgentDTO.portfolioCount,
      isDeleted: false,
    };
    const agencyAgent = await this.prisma.agencyAgent.create({
      data: agentData,
    });
    return agencyAgent;
  }
}
