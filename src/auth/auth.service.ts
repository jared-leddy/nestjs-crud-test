import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { message: 'I am logged in.' };
  }
  register() {
    return 'I am registered.';
  }
}
