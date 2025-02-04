import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string; // honda, toyota, 현다이 등

  @Column()
  model: string; // 머스탱 등등

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // 관계 설정, ManyToOne은 내부 디비의 변경을 초래함 (즉 user_id로 사용자의 아이디를 기록함). OneToMany는 변경되지 않음
  @ManyToOne(() => User, (user: User) => user.reports)
  user: User;
}
