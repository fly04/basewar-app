import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasePageRoutingModule } from './base-routing.module';
import { LayoutComponentsModule } from '../components/layout-components/layout-components.module';

import { BasePage } from './base.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasePageRoutingModule,
    LayoutComponentsModule,
  ],
  declarations: [BasePage],
})
export class BasePageModule {}
