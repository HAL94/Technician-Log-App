import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;
  auth$: Observable<boolean>;
  
  defualtImagePath = './assets/def_user_img.jpg';


  constructor(private authService: AuthService, public userService: UserService) { }

  ngOnInit() {
    this.auth$ = this.authService.getAuthenticationObs();    
    this.user$ = this.userService.getUserUpdate();
  }

  onLogout() {
    this.authService.logout();
  }

}
