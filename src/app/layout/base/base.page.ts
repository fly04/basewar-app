import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Base } from 'src/app/models/base';

@Component({
  selector: 'app-base',
  templateUrl: './base.page.html',
  styleUrls: ['./base.page.scss'],
})
export class BasePage implements OnInit {
  base: Base;
  baseId: string;

  constructor(private route: ActivatedRoute) {
    this.baseId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {}
}
