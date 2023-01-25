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
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';


// Components
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
import { WorkspaceBarComponent } from './components/main/dashboard/workspace-bar/workspace-bar.component';
import { ThreadBarComponent } from './components/main/dashboard/thread-bar/thread-bar.component';
import { ChannelBarComponent } from './components/main/dashboard/channel-bar/channel-bar.component';
import { DialogAddChannelComponent } from './components/main/dashboard/dialog-add-channel/dialog-add-channel.component';

// Ng Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

//Emoijs
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive'

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InfocardComponent } from './components/main/usercard/infocard/infocard.component';
import { EditsettingcardComponent } from './components/main/usercard/editsettingcard/editsettingcard.component';
import { DashboardHeaderComponent } from './components/main/dashboard/dashboard-header/dashboard-header.component';
import { ReauthenticateComponent } from './components/main/usercard/reauthenticate/reauthenticate.component';
import { ImgSrcPipe } from './pipes/imgSrc/img-src.pipe';
import { UsernamePipe } from './pipes/username/username.pipe';
import { DialogReactionComponent } from './components/main/dashboard/dialog-reaction/dialog-reaction.component';
import { DatePipe } from './pipes/date/date.pipe';
import { OpenboxComponent } from './openbox/openbox.component';
import { MessageBarComponent } from './components/main/dashboard/message-bar/message-bar.component';
import { NewMessageComponent } from './components/main/dashboard/new-message/new-message.component';
import { TelephonePipe } from './pipes/telephone/telephone.pipe';

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
    DashboardComponent,
    WorkspaceBarComponent,
    ThreadBarComponent,
    ChannelBarComponent,
    DialogAddChannelComponent,
    ClickStopPropagationDirective,
    InfocardComponent,
    EditsettingcardComponent,
    DashboardHeaderComponent,
    ReauthenticateComponent,
    ImgSrcPipe,
    UsernamePipe,
    DialogReactionComponent,
    DatePipe,
    OpenboxComponent,
    MessageBarComponent,
    NewMessageComponent,
    TelephonePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    PickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    AngularEditorModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
