import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/api/users.service';
import { ViewDidEnter } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  usersToDisplay: User[];
  testToDisplay: string[] = ['test1', 'test2', 'test3'];

  constructor(private usersService: UsersService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.usersService.getUsers().subscribe((users) => {
      this.usersToDisplay = users;
    });
  }
}
