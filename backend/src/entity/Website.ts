import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  status: string;
}