import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Website {
  @PrimaryGeneratedColumn('uuid')  // Automatically generates UUIDs for IDs
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: 'unknown' })
  status: string;
}