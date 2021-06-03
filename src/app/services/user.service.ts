import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/user';
import { configuration } from '../config/configuration';
import { environment } from 'src/environments/environment';
import { Otp } from '../models/otp';

@Injectable()
export class UserService {
  constructor(private http: HttpClient){};

  login(username: string, password: string): Observable<User> {
    const body = {
      'username': username,
      'password': password
    };
    return this.http.post<User>(
      environment.baseUrl + 'v1/login',
      body
    );

  }

  logout(): Observable<void> {
    return this.http.get<void>(
      environment.baseUrl + 'v1/logout'
    );

  }

  register(user: User, otp: String
    ): Observable<User> {
    const body = {
      'username': user.username,
      'password': user.password,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'email': user.email,
      'otp': otp,
    };
    return this.http.post<User>(
      environment.baseUrl + 'v1/register',
      body
    );

  }

  profile(): Observable<User> {
    return this.http.get<User>(
      environment.baseUrl + 'v1/profile'
    );

  }

  update(user: User): Observable<User> {
    const body = {
      'firstName': user.firstName,
      'lastName': user.lastName,
    };
    return this.http.put<User>(
      environment.baseUrl + 'v1/profile',
      body
    );

  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const body = {
      'oldPassword': oldPassword,
      'newPassword': newPassword
    };

    return this.http.post<void>(environment.baseUrl + 'v1/changePassword', body);
  }

  requestVerification(email: string): Observable<void> {
    const body = {
      'email': email
    };
    return this.http.get<void>(environment.baseUrl + 'v1/requestVerification', {
      params: body
    });

  }

  verify(email: string, otp: string): Observable<Otp> {
    const body = {
      'email': email,
      'otp': otp
    };
    return this.http.post<Otp>(environment.baseUrl + 'v1/verify', body);

  }

}
