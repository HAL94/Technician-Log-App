import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SignupRequest } from 'src/app/models/http-models/http-request-models/signup-request.model';
import { Subscription } from 'rxjs';
import { MatSnackService } from 'src/app/services/mat-snack.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private snackBarService: MatSnackService,
    private router: Router) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    if (form.valid) {
      
      this.isLoading = true;

      const authData: SignupRequest = {
        email: form.value.email,
        password: form.value.password,
        fname: form.value.firstName,
        lname: form.value.lastName,
        badgeNumber: form.value.badgeNumber
      };

      if (form.value.birthdate) {
        authData.birthDate = new Date(form.value.birthdate);
      }

      // console.log(authData);
      this.subscription = this.authService.signup(authData).subscribe((result) => {

        this.snackBarService.openSnackBar(result.message, 1000, this.snackBarService.snackbarSuccessConfig);

        this.router.navigate(['login']);
      });


    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
} 
