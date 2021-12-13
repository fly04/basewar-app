import { Component, OnInit } from '@angular/core';

declare type PageTab = {
  title: string;
  icon: string;
  path: string;
};

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  tabs: PageTab[];

  constructor() {
    this.tabs = [
      { title: 'Carte', icon: 'navigate', path: 'map' },
      { title: 'Classement', icon: 'podium', path: 'ranking' },
      { title: 'Profil', icon: 'happy', path: 'profile' },
    ];
  }

  ngOnInit() {}
}
