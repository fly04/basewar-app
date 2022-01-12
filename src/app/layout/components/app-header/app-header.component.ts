import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { WsMessagesService } from '../../../api/ws-messages.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  //   money: string;
  //   income: string;
  userStats: { income: string; money: string };

  constructor(
    private auth: AuthService,
    readonly wsMessagesService: WsMessagesService
  ) {
    wsMessagesService.updateUser$.subscribe((userStats) => {
      this.userStats = {
        money: userStats.money,
        income: userStats.income,
      };
    });
  }
}
