import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatusEnum } from 'src/user/constants/user.constant';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { MailTemplate } from 'src/mail/constant/mail.constant';
import { CreateAgentDTO } from './dto/create-agent.dto';
import { ContactStatusEnum, ContactTypeEnum, Prisma } from '@prisma/client';
import { AgentRoleEnum } from './constant/agent.constant';
import { CompanyService } from 'src/company/company.service';
import { pagination } from 'src/utils/pagination.util';
import Pagination from 'src/interfaces/pagination.interface';
import { OnboardTrackingService } from 'src/onboard-tracking/onboard-tracking.service';
import { ContactService } from 'src/contact/contact.service';
import { ContactPropertyService } from 'src/contact-property/contact-property.service';
import { ContactPropertyStatusEnum } from 'src/contact-property/constant/contact-property.constant';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly companyService: CompanyService,
    private readonly onboardTrackingService: OnboardTrackingService,
    private readonly contactService: ContactService,
    private readonly contactPropertyService: ContactPropertyService,
  ) {}

  async createAgent(agentDTO: CreateAgentDTO) {
    const newAgent = this.prisma.$transaction(async (repo) => {
      const user = await this.userService.getUserById(agentDTO.userId);

      const contact: Prisma.ContactCreateManyInput = {
        firstName: agentDTO.firstName,
        lastName: agentDTO.lastName,
        email: agentDTO.email,
        password: agentDTO.password,
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

  async updateAgent(data: Prisma.AgentUpdateInput, id: number) {
    if (!data.isActive) {
      data.assignPortfolioCount = 0;
      this.contactPropertyService.updateContactPropertyByContact(
        data.company.connect.id,
        { status: ContactPropertyStatusEnum.DELETED },
      );
    }
    const agent = await this.prisma.agent.update({
      where: {
        id,
      },
      data,
    });
    if (data.isDeleted) {
      await this.contactService.updateContact(agent.contactId, {
        status: ContactStatusEnum.DELETED,
      });
    }
    return agent;
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
        status: UserStatusEnum.INVITED,
        inviteSent: new Date(),
      };
      const newUser = await this.userService.createUser(user);
      agentDTO.userId = newUser.id;
      const newAgent = await this.createAgent(agentDTO);
      await this.onboardTrackingService.createOnboardTracking({
        userId: newUser.id,
        companyId: agentDTO.companyId,
      });
      const info = {
        url: `https://www.prisma.io/docs?agentId=${newAgent.id}`,
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

  async getAgentsByCompanyId(
    companyId: number,
    page: number,
    pageSize: number,
  ) {
    const { skip, take } = pagination(page, pageSize);
    const agents = await this.prisma.agent.findMany({
      select: {
        role: true,
        contact: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            user: {
              select: {
                inviteSent: true,
              },
            },
          },
        },
        isActive: true,
        isDeleted: true,
      },
      where: {
        companyId,
      },

      skip,
      take,
    });
    const totalItem = agents.length;
    const totalPage = Math.ceil(totalItem / pageSize);
    const data: Pagination = {
      page,
      pageSize,
      totalItem,
      totalPage,
      data: agents,
    };
    return data;
  }
}
