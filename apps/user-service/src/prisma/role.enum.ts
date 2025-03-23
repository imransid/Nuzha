import { registerEnumType } from '@nestjs/graphql';
export enum RoleUSER {
  ADMIN = 'ADMIN',
  USERS = 'USERS',
  SUPERUSER = 'SUPERUSER',
}

registerEnumType(RoleUSER, { name: 'role', description: 'User role enum' });
