import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'investment_categories' })
export class InvestmentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  description: string;
}