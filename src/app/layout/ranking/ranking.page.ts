import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/api/users.service';
import { ViewDidEnter } from '@ionic/angular';
import { UserRank } from 'src/app/models/user-rank';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  usersToDisplay: UserRank[];
  searchTerm: string;
  sortType: string;
  sortReverse: boolean;

  constructor(
    private usersService: UsersService,
    private orderPipe: OrderPipe
  ) {
    this.sortType = 'rank';
    this.sortReverse = false;
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.usersService.getUsers().subscribe((users) => {
      users = users.sort((a, b) =>
        a.money < b.money ? 1 : b.money < a.money ? -1 : 0
      );
      this.usersToDisplay = users.map((user, index) => ({
        id: user.id,
        rank: index + 1,
        name: user.name,
        money: user.money,
      }));
    });
  }
}
