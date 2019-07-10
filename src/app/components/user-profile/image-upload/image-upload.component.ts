import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material';

import { take } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { mimeType } from '../mime-type.validator';
import { ImageUploadModalComponent } from './image-file-modal/image-upload-modal.component';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {

  imgUploadForm: FormGroup;
  profileImagePath;
  defualtImagePath = './assets/def_user_img.jpg';

  private dialogRef: any;

  userSubscription: Subscription;
  paramSubscription: Subscription;

  constructor(private fb: FormBuilder, private dialog: MatDialog,
  private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.imgUploadForm = this.fb.group({
      profileImage: new FormControl(null, [Validators.required], mimeType)
    });

    const userLoc = this.userService.getUser();
    if (userLoc) {
      if (userLoc.profileImage !== null) {
        this.profileImagePath = userLoc.profileImage;
      }
    }

    this.userSubscription = this.userService.getUserUpdate().subscribe(user => {
      if (user.profileImage !== null) {
        this.profileImagePath = user.profileImage;
      }
    });
  }

  onImageSelection(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.imgUploadForm.patchValue({'profileImage': file});
    this.imgUploadForm.get('profileImage').updateValueAndValidity();

    this.paramSubscription = this.imgUploadForm.statusChanges.pipe(
      take (1)
    ).subscribe(status => {
      if (status === 'INVALID') {

        this.openDialog(false);

      } else if (status === 'VALID') {

        this.dialogRef = this.openDialog(true);

        const imageUpload = new FormData();
        imageUpload.append('profileImage', file);

        this.userService.updateUserProfileImageAPI(imageUpload, this.dialogRef);

      }
    });
  }

  private openDialog(validity) {
    return this.dialog.open(ImageUploadModalComponent, {
      width: '50%',
      height: 'auto',
      data: {isValid: validity}
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    } else if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
