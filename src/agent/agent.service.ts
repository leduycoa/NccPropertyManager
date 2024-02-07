import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatusEnum } from 'src/user/constants/user.constant';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { MailTemplate } from 'src/mail/constant/mail.constant';
import { CreateAgentDTO } from './dto/create-agent.dto';
import { ContactTypeEnum, Prisma } from '@prisma/client';
import { AgentRoleEnum } from './constant/agent.constant';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly companyService: CompanyService,
  ) {}

  async createAgent(agentDTO: CreateAgentDTO) {
    const newAgent = this.prisma.$transaction(async (repo) => {
      const user = await this.userService.getUserById(agentDTO.userId);

      const contact: Prisma.ContactCreateManyInput = {
        firstName: agentDTO.firstName,
        lastName: agentDTO.lastName,
        email: agentDTO.email,
        status: UserStatusEnum.ACTIVE,
        type: ContactTypeEnum.AGENT,
        userId: user.id,
      };

      const newContact = await repo.contact.create({
        data: contact,
      });

      const agent: Prisma.AgentCreateManyInput = {
        companyId: agentDTO.companyId,
        contactId: newContact.id,
        role: agentDTO.role,
        isActive: true,
        isDeleted: false,
        assignPortfolioCount: 0,
      };

      const newAgent = await repo.agent.create({
        data: agent,
      });
      return newAgent;
    });
    return newAgent;
  }

  async updateAgent(agent: Prisma.AgentUpdateInput, id: number) {
    this.prisma.agent.update({
      where: {
        id,
      },
      data: agent,
    });
    return;
  }

  async inviteAgent(agentDTOs: CreateAgentDTO[]) {
    const agentOwner = agentDTOs.find(
      (agent) => agent.role === AgentRoleEnum.OWNER,
    );

    if (agentOwner) {
      throw new BadRequestException(
        `Agent ${agentOwner.email} must be admin or member`,
      );
    }

    const company = await this.companyService.getCompanyById(
      agentDTOs[0].companyId,
    );

    const mailPromises = agentDTOs.map(async (agentDTO) => {
      const user: Prisma.UserCreateInput = {
        firstName: agentDTO.firstName,
        lastName: agentDTO.lastName,
        email: agentDTO.email,
        password: agentDTO.password,
        status: UserStatusEnum.ACTIVE,
        inviteSent: new Date(),
      };
      const newUser = await this.userService.createUser(user);
      const info = {
        url: `https://www.prisma.io/docs?userId=${newUser.id}&aencyId=${agentDTO.companyId}`,
      };
      await this.mailService.send({
        email: agentDTO.email,
        sender: company.companyEmail,
        template: MailTemplate.INVITE_AGENT,
        info,
      });
    });

    await Promise.all(mailPromises);
  }
}
