import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { UsersService } from '../../../api/users.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  money: string;
  income: string;

  constructor(private auth: AuthService, readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.sendMessage();
  }
}
