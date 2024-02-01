import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { RoleAgents } from 'src/decorators/role-agents.decorator';
import { UserTypeEnum } from 'src/user/constants/user.constant';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const roles = this.reflector.get(Roles, context.getHandler());
    const roleAgents = this.reflector.get(RoleAgents, context.getHandler());

    let check = true;
    if (roles) {
      check = roles.some((role) => user.type === role);
    }
    if (roleAgents) {
      const agent = await this.prisma.agencyAgent.findFirst({
        where: {
          userId: user.id,
        },
      });
      check =
        user.type === UserTypeEnum.AGENT &&
        roleAgents.some((role) => agent.role === role);
    }
    return check;
  }
}
