import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { WsMessagesService } from '../../../services/websocket/ws-messages.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  userStats: { income: string; money: string };

  constructor(
    private auth: AuthService,
    readonly wsMessagesService: WsMessagesService
  ) {
    this.userStats = { income: '0', money: '0' };

    this.auth.getUser$().subscribe((user) => {
      if (this.userStats.money !== '0') return;
      let lastSeenMoney = user.money;
      this.userStats.money = lastSeenMoney;
    });

    wsMessagesService.updateUser$.subscribe((userStats) => {
      this.userStats = {
        money: userStats.money,
        income: userStats.income,
      };
    });
  }
}
