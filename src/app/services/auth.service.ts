import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { SignupRequest } from '../models/http-models/http-request-models/signup-request.model';
import { LoginResponse } from '../models/http-models/http-response-models/login-response.model';
import { MatSnackService } from '../services/mat-snack.service';
import { UserService } from './user.service';
import { SignUpResponse } from '../models/http-models/http-response-models/signup-response.model';
import { LoginRequest } from '../models/http-models/http-request-models/login-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string;
  private authentication = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: any;
  private HTTP_URLS = environment.AUTH_URLS;

  constructor(private http: HttpClient,
    private router: Router,
    private snackBarService: MatSnackService,
    private userService: UserService) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  async signup(authData: SignupRequest) {
    try {
      const result = await this.http.post<SignUpResponse>(this.HTTP_URLS.signup, authData).toPromise();

      this.snackBarService.openSnackBar(result.message, 1000, this.snackBarService.snackbarSuccessConfig);

      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
    }
  }

  async login(authData: LoginRequest) {
    try {
      const result = await this.http.post<LoginResponse>(this.HTTP_URLS.login, authData)
        .toPromise();

      this.token = result.token;
      if (this.token) {
        this.snackBarService.openSnackBar('Login Successful!',
        1000,
        this.snackBarService.snackbarSuccessConfig)
        .subscribe(() => {
          this.isAuthenticated = true;
          this.authentication.next(this.isAuthenticated);

          this.setAuthTimer(result.expiresIn);

          this.userId = result.userId;
          this.userService.setUser(this.userId);

          const now = new Date();
          const expiration = new Date(now.getTime() + result.expiresIn * 1000);

          this.saveAuthData(result.token, expiration);

          this.router.navigate(['today-entries']);
        });
      }

    } catch (error) {
      console.log(error);
      this.isAuthenticated = false;
      this.authentication.next(this.isAuthenticated);
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.authentication.next(this.isAuthenticated);
    this.token = null;
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getAuthenticationObs(): Observable<boolean> {
    return this.authentication.asObservable();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const tokenExpiration = new Date(authInformation.expiration);
    const expiration = tokenExpiration.getTime() - now.getTime();

    if (expiration > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiration / 1000);
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.authentication.next(this.isAuthenticated);
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', this.userId);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('user');

    if (!token || !expiration || !userId) {
      return;
    }

    const authInformation = {
      token: token,
      expiration: expiration,
      userId: userId
    };

    return authInformation;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}


