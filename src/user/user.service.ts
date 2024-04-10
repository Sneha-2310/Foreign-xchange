import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly users = [
    { userId: 1, username: 'admin', password: 'adminpass', role: ['admin'] },
    { userId: 2, username: 'user', password: 'userpass', role: ['user'] },
  ];

  async findByUsername(username: string): Promise<any> {
    return this.users.find(user => user.username === username);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
