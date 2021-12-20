import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankingPageRoutingModule } from './ranking-routing.module';
import { LayoutComponentsModule } from '../components/layout-components/layout-components.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';

import { RankingPage } from './ranking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingPageRoutingModule,
    LayoutComponentsModule,
    Ng2SearchPipeModule,
    OrderModule,
  ],
  declarations: [RankingPage],
})
export class RankingPageModule {}
