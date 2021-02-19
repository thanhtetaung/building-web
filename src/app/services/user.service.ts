import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs/observable';
import { User } from '../models/user';
import { configuration } from '../config/configuration';

@Injectable()
export class UserService {
  constructor(private http: HttpClient){};

  login(username: string, password: string): Observable<User> {
    const body = {
      'username': username,
      'password': password
    };
    return this.http.post<User>(
      configuration.baseUrl + 'login',
      body
    );

  }

  logout(): Observable<void> {
    return this.http.get<void>(
      configuration.baseUrl + 'logout'
    );

  }

  register(user: User): Observable<User> {
    const body = {
      'username': user.username,
      'password': user.password,
      'firstName': user.firstName,
      'lastName': user.lastName,
    };
    return this.http.post<User>(
      configuration.baseUrl + 'register',
      body
    );

  }

  profile(): Observable<User> {
    return this.http.get<User>(
      configuration.baseUrl + 'profile'
    );

  }

  update(user: User): Observable<User> {
    const body = {
      'firstName': user.firstName,
      'lastName': user.lastName,
    };
    return this.http.put<User>(
      configuration.baseUrl + 'profile',
      body
    );

  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const body = {
      'oldPassword': oldPassword,
      'newPassword': newPassword
    };

    const promise = this.http.post<void>(configuration.baseUrl + 'changePassword', body);
    return promise;
  }


}
