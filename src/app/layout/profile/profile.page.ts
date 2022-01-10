import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/api/bases.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  actualUser: User;
  bases: Base[];

  constructor(
    // Inject the authentication provider.
    private auth: AuthService,
    private basesService: BasesService,
    // Inject the router
    private router: Router
  ) {}

  ngOnInit() {}

  // Add a method to log out.
  logOut() {
    console.log('logging out...');
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  ionViewDidEnter() {
    this.auth.getUser$().subscribe((user) => {
      this.actualUser = user;
    });
    this.basesService.getUserBases(this.actualUser).subscribe((bases) => {
      this.bases = bases;
    });
  }
}
