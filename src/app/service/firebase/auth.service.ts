import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, confirmPasswordReset, applyActionCode } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { signOut, UserCredential } from '@firebase/auth';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from '../current-data/current-data.service';
import { PushupMessageService } from '../pushup-message/pushup-message.service';
import { AuthErrorService } from './auth-error.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  newUser = new User();
  usernameNewUser!: string;

  constructor(
    private auth: Auth,
    private router: Router,
    private currentDataService: CurrentDataService,
    private pushupMessage: PushupMessageService,
    private authError: AuthErrorService,
    private firestoreService: FirestoreService
  ) { }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password!)
      .then((user: UserCredential) => {
        if (user.user?.emailVerified) {
          this.router.navigate(['/main']);
          this.pushupMessage.openPushupMessage('success', 'Login Successfully')
        } else {
          this.router.navigate(['/verification']);
          this.pushupMessage.openPushupMessage('info', 'Please verify your E-Mail Address')
        }
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async logout() {
    this.currentDataService.clearByLogout()
    await signOut(this.auth)
      .then(() => {
        this.pushupMessage.openPushupMessage('success', 'Logout successfully')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((user: UserCredential) => {
        this.saveNewUser(user);
        this.sendEmailVerification(user);
      })
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }

  async sendEmailVerification(user: UserCredential) {
    await sendEmailVerification(user.user)
      .then(() => {
        this.router.navigate(['/verification']);
        this.pushupMessage.openPushupMessage('info', 'Check your E-Mail Account')
      });
  }

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.router.navigate(['/login']);
        this.pushupMessage.openPushupMessage('success', 'Check your E-Mail Account');
      })
      .catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }
  async confirmPasswordReset(oobCode: string, password: string) {
    await confirmPasswordReset(this.auth, oobCode, password!)
      .then(() => {
        this.router.navigate(['/login']);
        this.pushupMessage.openPushupMessage('success', 'Password change successful')
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
  }
  async applyActionCode(oobCode: string) {
    await applyActionCode(this.auth, oobCode)
  }

  saveNewUser(user: UserCredential) {
    this.newUser.id = user.user.uid;
    this.newUser.mail = user.user.email!;
    this.newUser.name = this.usernameNewUser!;
    this.newUser.lastLogin = new Date();
    this.firestoreService.save(this.newUser, 'users')
  }
}