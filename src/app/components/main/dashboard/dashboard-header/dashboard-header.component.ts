import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfocardComponent } from 'src/app/components/usercard/infocard/infocard.component';
import { EditsettingcardComponent } from 'src/app/components/usercard/editsettingcard/editsettingcard.component';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(EditsettingcardComponent);
  }
}
