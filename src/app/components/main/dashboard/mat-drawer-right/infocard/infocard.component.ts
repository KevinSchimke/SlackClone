import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { ReauthenticateComponent } from '../../../dialogs/reauthenticate/reauthenticate.component';

@Component({
  selector: 'app-infocard',
  templateUrl: './infocard.component.html',
  styleUrls: ['./infocard.component.scss']
})
export class InfocardComponent {
  user$: Observable<any> = EMPTY;
  user = new User();
  userActive?: boolean;
  isLoggedInUser?: boolean;

  constructor(
    public childSelector: SidenavToggleService,
    private router: Router,
    public userService: UserService,
    private firestoreService: FirestoreService,
    private dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => this.getUser(params.id));
    this.subscribeThreadbarInit();
  }

  subscribeThreadbarInit() {
    this.childSelector.threadBarIsInit.subscribe(isLoaded => {
      if (isLoaded === true) this.childSelector.threadBar.open();
    });
  }

  getUser(uid: string) {
    this.user$ = this.firestoreService.getUser(uid);
    this.user$.subscribe((user: User) => {
      this.user = user;
      this.isLoggedInUser = this.checkIsLoggedInUser(user);
      this.userActive = this.userService.userState(user);
    });
  }

  checkIsLoggedInUser(user: User) {
    if (this.userService.currentUser.id === user.id) return true;
    return false;
  }

  openDialog(): void {
    this.dialog.open(ReauthenticateComponent);
  }

  closeThread() {
    this.childSelector.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }
} 