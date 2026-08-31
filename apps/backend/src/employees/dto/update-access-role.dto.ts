import { IsIn } from 'class-validator';
import type { Role } from '../../common/decorators/roles.decorator';

const ROLES: Role[] = ['admin', 'hr', 'manager', 'employee'];

export class UpdateAccessRoleDto {
  @IsIn(ROLES)
  role: Role;
}
