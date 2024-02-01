import { Reflector } from '@nestjs/core';

export const RoleAgents = Reflector.createDecorator<string[]>();
