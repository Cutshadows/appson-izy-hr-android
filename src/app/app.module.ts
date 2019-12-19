import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { SQLite } from '@ionic-native/sqlite/ngx';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';

import { Network } from '@ionic-native/network/ngx';
import { ModalPageModule } from './members/modal/modal.module';
import { OptionmodalPageModule } from './members/optionmodal/optionmodal.module';

import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IntroductionService } from './services/introduction.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    ModalPageModule,
    OptionmodalPageModule
  ],
  providers: [
    BackgroundGeolocation,
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationAccuracy,
	UniqueDeviceID,
	LocalNotifications,
	IntroductionService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativePageTransitions,
    SQLite,
	Network,
	FCM
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
