import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environment/environment';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main.component';

// Ng Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotpasswordComponent } from './components/authentication/forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { SetnewpasswordComponent } from './components/authentication/setnewpassword/setnewpassword.component';
import { VerifyuserComponent } from './components/authentication/verifyuser/verifyuser.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataprotectionComponent } from './components/dataprotection/dataprotection.component';
import { DialoginputComponent } from './components/main/dialoginput/dialoginput.component';
import { DashboardComponent } from './components/main/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ForgotpasswordComponent,
    RegistrationComponent,
    SetnewpasswordComponent,
    VerifyuserComponent,
    ImprintComponent,
    DataprotectionComponent,
    DialoginputComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    BrowserAnimationsModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
