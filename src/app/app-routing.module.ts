import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'contact-us', canActivate: [AuthGuard], component: ContactUsComponent },
  { path: 'about-us', canActivate: [AuthGuard], component: AboutUsComponent },
  { path: 'profile', canActivate: [AuthGuard], component: UserProfileComponent },
  { path: 'profile', canActivate: [AuthGuard], component: UserProfileComponent },
  { path: 'questions/:id', canActivate: [AuthGuard], component: QuestionDetailComponent },
  { path: 'files', component: FileUploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
