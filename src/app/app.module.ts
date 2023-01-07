import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { environment } from 'src/environment/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Compontens
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataprotectionComponent } from './components/dataprotection/dataprotection.component';

// Authentication Components
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgotpasswordComponent } from './components/authentication/forgotpassword/forgotpassword.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { SetnewpasswordComponent } from './components/authentication/setnewpassword/setnewpassword.component';
import { VerifyuserComponent } from './components/authentication/verifyuser/verifyuser.component';

// Main Components
import { MainComponent } from './components/main/main.component';
import { DialoginputComponent } from './components/main/dialoginput/dialoginput.component';
import { DashboardComponent } from './components/main/dashboard/dashboard.component';

// Ng Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

//Emoijs
import { PickerModule } from '@ctrl/ngx-emoji-mart'

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
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    PickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
