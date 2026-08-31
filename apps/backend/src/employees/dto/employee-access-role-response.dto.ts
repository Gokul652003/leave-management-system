import type { Role } from '../../common/decorators/roles.decorator';
import { EmployeeResponseDto } from './employee-response.dto';

export class EmployeeAccessRoleResponseDto extends EmployeeResponseDto {
  accessRole: Role | null;
}
