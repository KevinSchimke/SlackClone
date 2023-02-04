import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
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
    private route: ActivatedRoute,
    private currentDataService: CurrentDataService) { }

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
    this.currentDataService.usersAreLoaded$.subscribe(isLoaded => {
      if (isLoaded === true) {
        this.user = this.currentDataService.users.find((user: User) => user.id === uid)!;
        this.isLoggedInUser = this.checkIsLoggedInUser(this.user);
        this.userActive = this.userService.userState(this.user);
      }
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