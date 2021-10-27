import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';

import { User } from '../models/user.model';
import { MatSnackService } from './mat-snack.service';
import { MatDialogRef } from '@angular/material';
import { ImageUploadModalComponent } from '../components/user-profile/image-upload/image-file-modal/image-upload-modal.component';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private user: User;
  private userUpdated = new BehaviorSubject<User>(null);
  private HTTP_URLS = environment.USER_URLS;

  constructor(private http: HttpClient, private snackBarService: MatSnackService) { }

  async setUser(userId: string) {
    try {
      console.log('userid', userId);
      const url = this.HTTP_URLS.setUser + userId;

      const response = await this.http.get<{fetchedUser: User}>(url).toPromise();

      this.user = response.fetchedUser;
      // console.log(this.user);
      this.updateUser();
    } catch (error) {
      console.log(error);
    }

  }

  async updateUserProfile(user: User) {
    try {
      const url = this.HTTP_URLS.updateUser + user.id;

      const response = await this.http
      .put<{message: string, fetchedUser: User}>(url, user)
      .toPromise();

      this.user = response.fetchedUser;

      this.updateUser();
      this.snackBarService.openSnackBar('Update Successful', 1500, this.snackBarService.snackbarSuccessConfig);
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserProfileImageAPI(imageUpload: FormData,
    dialogRef: MatDialogRef<ImageUploadModalComponent>) {
    try {
      const url = this.HTTP_URLS.updateUserProfile + this.user.id;

      const result = await this.http
      .patch<{message: string, profileImage: string}>(url, imageUpload).toPromise();

      this.user.profileImage = result.profileImage;

      this.snackBarService.openSnackBar('Update Successful', 1500, this.snackBarService.snackbarSuccessConfig);

      this.updateUser();

      dialogRef.close();
    } catch (error) {
      console.log(error);
      dialogRef.close();
    }
  }

  getUser() {
    return this.user;
  }

  getUserUpdate() {
    return this.userUpdated.asObservable();
  }

  updateUser() {
    this.userUpdated.next(this.user);
  }

  nullifyUser() {
    this.user = null;
    this.updateUser();
  }

}
