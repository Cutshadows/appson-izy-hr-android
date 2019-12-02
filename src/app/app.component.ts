import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Storage } from '@ionic/storage';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
	fcmMessage:any;
	fcmTitle:any;
	logoUrl='assets/img/logo.png';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private storage: Storage,
    public navController: NavController,
	private nativePageTransitions: NativePageTransitions,
	private fcm:FCM,
	private router:Router,
	private localNotifications:LocalNotifications,
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
		this.fcm.onNotification().subscribe((notification) => {
			this.fcmTitle = notification.title;
			this.fcmMessage = notification.body;
			if(notification.wasTapped) {
			} else {
			  this.localNotificationFcm(this.fcmTitle, this.fcmMessage);
			}
		  });
		this.fcm.getToken().then((tokn)=>{
	  	});
		this.statusBar.styleDefault();
      	this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {
        if(state) {
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);
          this.navController.navigateRoot(['members', 'dashboard'])
        } else {
          let options: NativeTransitionOptions = {
            duration: 800
          }
          this.nativePageTransitions.fade(options);
          this.navController.navigateRoot(['login'])
        }
	  });
	});
  }
  localNotificationFcm(fcmTitle, fcmMessage) {
	this.localNotifications.schedule({
	  title: fcmTitle,
	  text: fcmMessage,
	  vibrate:true,
	  led: { color: '#FF00FF', on: 500, off: 500 },
	  icon: this.logoUrl,
	  foreground: true
	})
  }
}
