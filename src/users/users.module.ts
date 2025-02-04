import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  imports: [TypeOrmModule.forFeature([User])], /// 이걸 통해 repository가 자동으로 생성
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*'); // global middle ware
  }
}
