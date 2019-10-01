import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    FooterComponent, 
    MenuFooterComponent, 
    HeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FooterComponent, 
    HeaderComponent, 
    MenuFooterComponent
  ]
})

export class ComponentsModule {

}