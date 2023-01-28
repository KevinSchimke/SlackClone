import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { ReauthenticateComponent } from '../reauthenticate/reauthenticate.component';

@Component({
  selector: 'app-infocard',
  templateUrl: './infocard.component.html',
  styleUrls: ['./infocard.component.scss']
})
export class InfocardComponent {
  user$: Observable<any> = EMPTY;
  user = new User();
  userActive?: boolean;
  lastLogin: any

  constructor(public sidenavToggler: SidenavToggleService, private router: Router, public userService: UserService, private firestoreService: FirestoreService, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.getUser(params.id);
      this.userActive = false;
      this.userState();
    });
  }

  userState() {
    let lastLoginTimestamp = this.user.lastLogin;
    let lastLoginDate = new Date((lastLoginTimestamp.seconds + lastLoginTimestamp.nanoseconds / 1e9) * 1000);
    let currentTime = new Date().getTime();

    if (currentTime - lastLoginDate.getTime() > 6000) {
      this.userActive = true;
    } else {
      this.userActive = false;
    }
  }

  getUser(uid: string) {
    this.user$ = this.firestoreService.getUser(uid);
    this.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  openDialog(): void {
    this.dialog.open(ReauthenticateComponent);
  }

  closeThread() {
    this.sidenavToggler.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }
}
