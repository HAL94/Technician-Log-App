import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { LoginRequest } from 'src/app/models/http-models/http-request-models/login-request.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      console.log(this.isLoading);
      const authData: LoginRequest = {
        email: form.value.email,
        password: form.value.password
      };
      this.authService.login(authData);
      this.subscription = this.authService.getAuthenticationObs().subscribe(authentication => {
        if (authentication) {
          this.isLoading = false;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
