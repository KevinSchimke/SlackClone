import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Compontens
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataprotectionComponent } from './components/dataprotection/dataprotection.component';

// Authentication Components
import { ForgotpasswordComponent } from './components/authentication/forgotpassword/forgotpassword.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { SetnewpasswordComponent } from './components/authentication/setnewpassword/setnewpassword.component';
import { VerifyuserComponent } from './components/authentication/verifyuser/verifyuser.component';

// Main Components
import { MainComponent } from './components/main/main.component';
import { ChannelBarComponent } from './components/main/dashboard/channel-bar/channel-bar.component';
import { AuthFirebaseGuard } from './guard/auth-firebase.guard';
import { ThreadBarComponent } from './components/main/dashboard/thread-bar/thread-bar.component';
import { InfocardComponent } from './components/main/usercard/infocard/infocard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'imprint', component: ImprintComponent },
  { path: 'dataprotection', component: DataprotectionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'verification', component: VerifyuserComponent },
  { path: 'reset', component: ForgotpasswordComponent },
  { path: 'response', component: SetnewpasswordComponent },
  {
    path: 'main', component: MainComponent, canActivate: [AuthFirebaseGuard],
    children: [
      { path: ':id', component: ChannelBarComponent },
      { path: 'profile/:id', component: InfocardComponent, outlet: 'right' },
      { path: ':id/:id', component: ThreadBarComponent, outlet: 'right' }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
