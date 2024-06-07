import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  priority: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.id)
  user: User;
}
