import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  status: string;
}