import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [AppHeaderComponent],
})
export class LayoutComponentsModule {}
