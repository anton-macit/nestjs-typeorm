import { Role } from '../role.enum';

export interface UserDto {
  id: string;
  username: string;
  roles: Role[];
}
