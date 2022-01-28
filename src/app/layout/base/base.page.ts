import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/services/api/bases.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Investment } from 'src/app/models/investment';
import { User } from 'src/app/models/user';
import { forkJoin } from 'rxjs';

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

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private basesService: BasesService
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

  ionViewDidEnter() {
    this.basesService.getBase(this.actualBaseId).subscribe((base) => {
      this.actualBase = base;
    });
    this.basesService
      .getInvestments(this.actualBaseId)
      .subscribe((investment) => {
        this.investments = investment;
      });
  }
}
