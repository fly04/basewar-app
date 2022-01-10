import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponentsModule } from '../components/layout-components/layout-components.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    LayoutComponentsModule,
    LeafletModule,
  ],
  declarations: [MapPage],
})
export class MapPageModule {}
