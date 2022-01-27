import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/services/api/bases.service';
import { UsersService } from 'src/app/services/api/users.service';
import { ThrowStmt } from '@angular/compiler';
import { observable, Observable, ReplaySubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  actualUser: User;
  user: User;
  userId: string;
  bases: Base[];
  editionMode: boolean;

  constructor(
    // Inject the authentication provider.
    private auth: AuthService,
    private route: ActivatedRoute,
    private basesService: BasesService,
    private usersService: UsersService,
    // Inject the router
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    // Get the actual logged user
    this.auth.getUser$().subscribe((user) => {
      this.actualUser = user;
    });
  }

  updateUserName(user: User) {
    this.editionMode = false;
    // Nécessaire ?
    if (user !== this.actualUser) {
      return;
    }

    this.user = user;

    this.usersService
      .patchUserName(user.id, user.name)
      .subscribe((userToUpdate) => {
        this.auth.updateAuth(userToUpdate);
      });
  }

  async deleteUser(user: User) {
    const alert = await this.alertController.create({
      header: 'Supprimer le compte',
      message: 'Voulez-vous vraiment supprimer votre compte ?',
      buttons: [
        { text: 'Oui', role: 'true' },
        { text: 'Non', role: 'false' },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'true') {
      this.usersService.deleteUser(user.id).subscribe(() => {
        this.authService.notify(`Utilisateur ${this.user.name} a été supprimé`);
        this.logOut();
      });
    }
  }
  // Add a method to log out.
  logOut() {
    console.log('logging out...');
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  ionViewDidEnter() {
    this.editionMode = false;

    const sub = new ReplaySubject();

    // There is a user id in param and it's different that the actual logged user
    if (this.userId && this.userId !== this.actualUser.id) {
      this.usersService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        sub.next();
      });
    } else {
      this.user = this.actualUser;
      sub.next();
    }

    sub.subscribe(() => {
      this.basesService.getUserBases(this.user).subscribe((bases) => {
        this.bases = bases;
      });
    });
  }
}
