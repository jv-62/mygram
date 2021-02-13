import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { PagenotfoundComponent } from '../components/pagenotfound/pagenotfound.component';
import { AuthGuard } from '../services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemoMaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPostComponent } from './view-post/view-post.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ConfirmationDialogService } from './dashboard/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './dashboard/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TextMaskModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '', component: HomeComponent, children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
          { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
          { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
          { path: 'viewpost', component: ViewPostComponent, canActivate: [AuthGuard] },
          { path: 'create-post', component: CreatepostComponent, canActivate: [AuthGuard] },
          { path: '**', component: PagenotfoundComponent },
        ],
      },
    ]),
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    CreatepostComponent,
    ViewPostComponent,
    EditProfileComponent,
    ConfirmationDialogComponent
  ],
  providers: [ ConfirmationDialogService ],
  entryComponents: [ ConfirmationDialogComponent ],
})
export class HomeModule { }
