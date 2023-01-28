import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth, deleteUser, updateEmail, updatePassword, signOut, sendEmailVerification } from '@angular/fire/auth';
import { Storage, ref, uploadBytesResumable, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {

  @ViewChild('phone') phone?: ElementRef
  username = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  email = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  deletUsername: string = '';

  step = -1;
  hide = true;

  public statusValue: any = '';

  file: any = {};
  path = '';
  storageRef!: StorageReference;

  constructor(
    public auth: Auth,
    private firestoreService: FirestoreService,
    private authError: AuthErrorService,
    private pushupMessage: PushupMessageService,
    private fireStorage: Storage,
    private dialogRef: MatDialogRef<EditsettingcardComponent>,
    public userService: UserService) {
    this.statusValue = this.userService.currentUser.status;
  }

  setStep(index: number) {
    this.step = index;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateUserData() {
    this.firestoreService.updateUser(this.userService.get().toJson());
  }

  updateUserName() {
    if (this.username.valid) {
      let username = this.username.value.username;
      this.userService.currentUser.name = username!;
      this.updateUserData();
    }
  }

  updatePhone() {
    const phone = this.phone!.nativeElement.value;
    this.userService.currentUser.phone = phone!
    this.updateUserData();
  }

  updateStatus() {
    this.userService.currentUser.status = this.statusValue;
    this.updateUserData();
  }

  updateUserEmail() {
    if (this.email.valid) {
      let email = this.email.value.email!;
      updateEmail(this.auth.currentUser!, email)
        .then(() => {
          this.userService.currentUser.mail = email!;
          this.updateUserData();
          sendEmailVerification(this.auth.currentUser!)
          this.pushupMessage.openPushupMessage('success', 'Please verify your new email')
          this.closeDialog();
          this.logout();
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  updateUserPassword() {
    if (this.password.valid) {
      let password = this.password.value.password!;
      updatePassword(this.auth.currentUser!, password)
        .then(() => {
          this.pushupMessage.openPushupMessage('success', 'Update password successfully')
          this.closeDialog();
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  async deleteCurrentUser() {
    await this.firestoreService.deleteUser();
    await deleteUser(this.auth.currentUser!)
    location.reload();
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleClick($event: EmojiEvent) {
    this.statusValue += $event.emoji.native;
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.authError.getErrorMessage(formGroup, formControlName)
  }

  upload = ($event: any) => {
    this.file = $event.target.files[0];
    if (this.file.size > 3000000) {
      this.pushupMessage.openPushupMessage('error', 'Your upload is too large, select a file smaller than 3 MB!');
      return
    }
    const randomId = Math.random().toString(36).substring(2);
    this.path = `images/${randomId}`;
    this.storageRef = ref(this.fireStorage, this.path);
    const uploadTask = uploadBytesResumable(this.storageRef, this.file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      switch (snapshot.state) {
        case 'canceled':
          this.pushupMessage.openPushupMessage('error', 'Upload is canceled');
          break;
        case 'running':
          this.pushupMessage.openPushupMessage('info', 'Upload is running' + progress + '%')
          break;
      }
    },
      (error) => {
        this.pushupMessage.openPushupMessage('error', error.message)
      }
      ,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.userService.currentUser.src = downloadURL;
          this.updateUserData();
          this.pushupMessage.openPushupMessage('success', 'Upload success')
        });
      });
  }


}
