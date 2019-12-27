import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    MenuFooterComponent,
    HeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    MenuFooterComponent
  ]
})

export class ComponentsModule {

}
