import { Component, OnInit } from '@angular/core';
import { BasesService } from '../../../app/api/bases.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  constructor(readonly basesService: BasesService) {}

  ngOnInit() {}
}
