import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyAgentDTO } from './dto/create-agency-agent.dto';
import { AgencyAgent, Prisma, User } from '@prisma/client';
import { UserTypeEnum, UserstatusEnum } from 'src/user/constants/user.constant';
import { AgencyAgentTypeEnum } from './constant/agency-agent.constant';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { agent } from 'supertest';
import { hashedPassword } from 'src/utils/hash-password.util';
import { date } from '@hapi/joi';
import { MailTemplate } from 'src/mail/constant/mail.constant';

@Injectable()
export class AgencyAgentService {
  private readonly logger = new Logger(AgencyAgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async createAgencyAgent(agencyAgentDTOs: CreateAgencyAgentDTO[]) {
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

    await this.prisma.user.createMany({
      data: users,
    });

    const newUsers = await this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });

    const agents: Prisma.AgencyAgentCreateManyInput[] = newUsers.map((user) => {
      const agencyAgentDTO = agencyAgentDTOs.find(
        (agencyAgentDTO) => agencyAgentDTO.email === user.email,
      );
      return {
        agencyId: agencyAgentDTO.agencyId,
        userId: user.id,
        role: agencyAgentDTO.type,
        isActive: true,
        isDeleted: false,
      };
    });

    return await this.prisma.agencyAgent.createMany({
      data: agents,
    });
  }

  async inviteAgent(agencyAgentDTOs: CreateAgencyAgentDTO[], user: User) {
    const agents = await this.createAgencyAgent(agencyAgentDTOs);
    const mails: string[] = agencyAgentDTOs.map(
      (agencyAgentDTO) => agencyAgentDTO.email,
    );
    await this.mailService.send(mails, user.email, MailTemplate.INVITE_AGENT);
    return agents;
  }
}
