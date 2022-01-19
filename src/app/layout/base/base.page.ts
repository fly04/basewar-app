import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Base } from 'src/app/models/base';
import { BasesService } from 'src/app/api/bases.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Investment } from 'src/app/models/investment';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
})
export class BasePage implements OnInit {
  actualBase: Base;
  actualBaseId: string;
  editionMode: boolean;
  investments: Investment[];

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private basesService: BasesService
  ) {
    this.actualBaseId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.editionMode = false;
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
