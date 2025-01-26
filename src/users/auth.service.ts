import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { NotFoundError } from 'rxjs';
import { stdout } from 'process';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash ths user passwrod
    // generate salt
    const salt = randomBytes(8).toString('hex'); // 16진수로 만듦, 16자리 문자열이 됨
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 결과는 32자리

    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    // await 이 필요한가 ?
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('user not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
