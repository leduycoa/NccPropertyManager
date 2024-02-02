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

@Injectable()
export class AgencyAgentService {
  private readonly logger = new Logger(AgencyAgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly agencyService: AgencyService,
  ) {}

  async createAgencyAgent(agencyAgentDTOs: CreateAgencyAgentDTO[]) {
    const agent = this.prisma.$transaction(async (repo) => {
      const emails = agencyAgentDTOs.map((agencyAgentDTO) => {
        return agencyAgentDTO.email;
      });

      await this.userService.checkEmailExist(emails);

      const userPromises: Promise<Prisma.UserCreateManyInput>[] =
        agencyAgentDTOs.map(async (agencyAgentDTO) => {
          if (agencyAgentDTO.password) {
            agencyAgentDTO.password = await hashedPassword(
              agencyAgentDTO.password,
            );
          }
          const user = {
            firstName: agencyAgentDTO.firstName,
            lastName: agencyAgentDTO.lastName,
            email: agencyAgentDTO.email,
            password: agencyAgentDTO.password,
            status: UserstatusEnum.ACTIVE,
            type: UserTypeEnum.AGENT,
          };

          return user;
        });

      const results: Prisma.UserCreateManyInput[] =
        await Promise.all(userPromises);
      const users: Prisma.UserCreateManyInput[] = results.map((result) => ({
        ...result,
      }));

      await repo.user.createMany({
        data: users,
      });

      const newUsers = await repo.user.findMany({
        where: {
          email: {
            in: emails,
          },
        },
      });

      const agents: Prisma.AgencyAgentCreateManyInput[] = newUsers.map(
        (user) => {
          const agencyAgentDTO = agencyAgentDTOs.find(
            (agencyAgentDTO) => agencyAgentDTO.email === user.email,
          );
          return {
            agencyId: agencyAgentDTO.agencyId,
            userId: user.id,
            role: agencyAgentDTO.role,
            inviteTime: new Date(),
            isActive: true,
            isDeleted: false,
          };
        },
      );

      return await repo.agencyAgent.createMany({
        data: agents,
      });
    });
    return agent;
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
    await this.createAgencyAgent(agencyAgentDTOs);

    const agency = await this.agencyService.getAgencyById(
      agencyAgentDTOs[0].agencyId,
    );

    const mailPromises = agencyAgentDTOs.map(async (agent) => {
      const user = await this.userService.getUserByEmail(agent.email);

      const info = {
        url: `https://www.prisma.io/docs?userId=${user.id}&agencyId=${agent.agencyId}`,
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
