import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleContacts } from '../decorators/roles-contact.decorator';
import { RoleAgents } from 'src/decorators/role-agents.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactTypeEnum } from 'src/contact/constants/contact.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const payload = request.body;

    const roleContacts = this.reflector.get(RoleContacts, context.getHandler());
    const roleAgents = this.reflector.get(RoleAgents, context.getHandler());

    const contacts = await this.prisma.contact.findMany({
      where: {
        userId: user.id,
      },
    });
    let permission: boolean = true;
    if (roleContacts) {
      permission = roleContacts.some((role) =>
        contacts.some((contact) => contact.type === role),
      );
    } else {
      permission = false;
    }

    if (roleAgents && !permission) {
      if (!contacts.some((contact) => contact.type === ContactTypeEnum.AGENT)) {
        permission = false;
      } else {
        const contactIds = contacts.map((contact) => contact.id);
        const agents = await this.prisma.agent.findMany({
          where: {
            AND: {
              contactId: {
                in: contactIds,
              },
              companyId: payload.companyId,
            },
          },
        });
        permission = roleAgents.some((role) =>
          agents.some((a) => a.role === role),
        );
      }
    }
    return permission;
  }
}
