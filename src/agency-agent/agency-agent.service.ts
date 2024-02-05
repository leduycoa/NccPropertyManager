import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyAgentDTO } from './dto/create-agency-agent.dto';
import { AgencyAgent, Prisma, User } from '@prisma/client';
import { UserTypeEnum, UserstatusEnum } from 'src/user/constants/user.constant';
import { AgencyAgentRoleEnum } from './constant/agency-agent.constant';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { agent } from 'supertest';
import { hashedPassword } from 'src/utils/hash-password.util';
import { date } from '@hapi/joi';
import { MailTemplate } from 'src/mail/constant/mail.constant';
import { AgencyService } from 'src/agency/agency.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AgencyAgentService {
  private readonly logger = new Logger(AgencyAgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly agencyService: AgencyService,
    private readonly jwtService: JwtService,
  ) {}

  async createAgencyAgent(agentDTO: CreateAgencyAgentDTO, token?: string) {
    if (token) {
      const payload: CreateAgencyAgentDTO = this.jwtService.verify(token);
      agentDTO = {
        ...payload,
        ...agentDTO,
      };
    }

    await this.userService.checkEmailExist(agentDTO.email);
    await this.userService.checkUserNameExist(agentDTO.userName);

    if (agentDTO.password) {
      agentDTO.password = await hashedPassword(agentDTO.password);
    }

    const newAgent = this.prisma.$transaction(async (repo) => {
      const user = {
        firstName: agentDTO.firstName,
        lastName: agentDTO.lastName,
        email: agentDTO.email,
        password: agentDTO.password,
        status: UserstatusEnum.ACTIVE,
        type: UserTypeEnum.AGENT,
        userName: agentDTO.userName,
      };

      const newUser = await repo.user.create({
        data: user,
      });

      const agent = {
        agencyId: agentDTO.agencyId,
        userId: newUser.id,
        role: agentDTO.role,
        inviteTime: new Date(),
        isActive: true,
        isDeleted: false,
      };

      const newAgent = await repo.agencyAgent.create({
        data: agent,
      });
      return newAgent;
    });
    return newAgent;
  }

  async updateAgent(agencyAgent: Prisma.AgencyAgentUpdateInput, id: string) {
    this.prisma.agencyAgent.update({
      where: {
        id,
      },
      data: agencyAgent,
    });
    return;
  }

  async inviteAgent(agencyAgentDTOs: CreateAgencyAgentDTO[]) {
    const agentOwner = agencyAgentDTOs.find(
      (agent) => agent.role === AgencyAgentRoleEnum.OWNER,
    );

    if (agentOwner) {
      throw new BadRequestException(
        `Agent ${agentOwner.email} must be admin or member`,
      );
    }

    const agency = await this.agencyService.getAgencyById(
      agencyAgentDTOs[0].agencyId,
    );

    const mailPromises = agencyAgentDTOs.map(async (agent) => {
      const payload = {
        ...agent,
      };
      const token = this.jwtService.sign(payload);
      const info = {
        url: `https://www.prisma.io/docs?token=${token}`,
      };
      await this.mailService.send({
        email: agent.email,
        sender: agency.companyEmail,
        template: MailTemplate.INVITE_AGENT,
        info,
      });
    });

    await Promise.all(mailPromises);
  }
}
