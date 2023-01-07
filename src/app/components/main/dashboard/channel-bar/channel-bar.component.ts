import { Component } from '@angular/core';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  isGoToThreadHovered = false;
  constructor(public sidenavToggler: SidenavToggleService){}
}
