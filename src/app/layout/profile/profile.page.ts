import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/services/api/bases.service';
import { UsersService } from 'src/app/services/api/users.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  actualUser: User;
  bases: Base[];
  editionMode: boolean;

  constructor(
    // Inject the authentication provider.
    private auth: AuthService,
    private basesService: BasesService,
    private usersService: UsersService,
    // Inject the router
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.getUser$().subscribe((user) => {
      this.actualUser = user;
    });
    this.editionMode = false;
  }

  updateUserName(user: User) {
    this.editionMode = false;
    this.actualUser = user;
    this.usersService
      .patchUserName(user.id, user.name)
      .subscribe((userToUpdate) => {
        this.auth.updateAuth(userToUpdate);
      });
  }

  // Add a method to log out.
  logOut() {
    console.log('logging out...');
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  ionViewDidEnter() {
    this.basesService.getUserBases(this.actualUser).subscribe((bases) => {
      this.bases = bases;
    });
  }
}
