import { Reflector } from '@nestjs/core';

export const RoleContacts = Reflector.createDecorator<string[]>();
