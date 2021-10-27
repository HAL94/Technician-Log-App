import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { EditProfileComponent } from 'src/app/components/user-profile/edit-profile/edit-profile.component';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

const routes: Routes = [
  {path: '', component: UserProfileComponent, canActivate: [AuthGuard], children: [
    {path: '', redirectTo: 'edit-profile', pathMatch: 'full'},
    {path: 'edit-profile', component: EditProfileComponent}
  ]},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class UserProfileRoutingModule { }
