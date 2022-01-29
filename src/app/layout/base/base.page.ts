import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/services/api/bases.service';
import { UsersService } from 'src/app/services/api/users.service';
import { ShowBaseService } from 'src/app/services/show-base.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Investment } from 'src/app/models/investment';
import { User } from 'src/app/models/user';
import { forkJoin } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
})
export class BasePage implements OnInit {
  actualBase: Base;
  actualBaseId: string;
  actualUser: User;
  editionMode: boolean;
  investments: Investment[];
  baseOwner: User;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private basesService: BasesService,
    private usersService: UsersService,
    private showBaseService: ShowBaseService,
    private alertController: AlertController
  ) {
    this.actualBaseId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.editionMode = false;

    // Get the actual logged user
    this.auth.getUser$().subscribe((user) => {
      this.actualUser = user;
    });
  }

  updateBaseName(base: Base) {
    this.editionMode = false;
    this.actualBase = base;
    this.basesService.patchBaseName(base.id, base.name).subscribe();
  }

  async deleteBase(base: Base) {
    const alert = await this.alertController.create({
      header: 'Supprimer la base',
      message: 'Voulez-vous vraiment supprimer cette base ?',
      buttons: [
        { text: 'Oui', role: 'true' },
        { text: 'Non', role: 'false' },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'true') {
      this.basesService
        .deleteBase(base.id)
        .subscribe(() => this.router.navigate(['/map']));
    }
  }

  ionViewDidEnter() {
    this.basesService.getBase(this.actualBaseId).subscribe((base) => {
      this.actualBase = base;

      this.usersService.getUser(this.actualBase.owner.id).subscribe((user) => {
        this.baseOwner = user;
      });
    });
    this.basesService
      .getInvestments(this.actualBaseId)
      .subscribe((investment) => {
        this.investments = investment;
      });
  }

  showOnMap() {
    this.showBaseService.setBaseId(this.actualBaseId);
    this.router.navigate(['/map']);
  }
}
