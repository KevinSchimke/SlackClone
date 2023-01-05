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


const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'imprint', component: ImprintComponent },
  { path: 'dataprotection', component: DataprotectionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'verification', component: VerifyuserComponent },
  { path: 'reset', component: ForgotpasswordComponent },
  { path: 'newpassword', component: SetnewpasswordComponent },
  { path: 'main', component: MainComponent },
  // { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
