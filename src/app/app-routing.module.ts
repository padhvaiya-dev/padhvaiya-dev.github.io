import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'user/:id', canActivate: [AuthGuard], component: UserProfileComponent },
  { path: 'questions/:id',component: QuestionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
