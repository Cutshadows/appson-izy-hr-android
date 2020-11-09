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
import { IntroductionService } from './services/introduction.service';
import { DarkthemeService } from './services/darktheme.service';
//import { CodePush, SyncStatus } from '@ionic-native/code-push/ngx';
import { FunctionsService } from './services/functions.service';


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
	private _tutorial:IntroductionService,
	private darkTheme:DarkthemeService,
	//private codePush:CodePush,
	private _function:FunctionsService
  ) {
    this.initializeApp();
  }
  initializeApp() {

    this.platform.ready().then(() => {
		this._tutorial.cargar_storage()
		.then(()=>{
		  if(this._tutorial.introduccion.mostrar_tutorial){
			let options: NativeTransitionOptions = {
			  duration: 800
			}
			this.nativePageTransitions.fade(options);
			this.router.navigate(['Introduction']);
		  }else{
			let options: NativeTransitionOptions = {
			  duration: 800
			}
			this.nativePageTransitions.fade(options);
			this.router.navigate(['login']);
		  }
		});
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
			/* if(this.platform.is('android')){
				this.codePush.sync({}, (progress)=>{

				}).subscribe((status)=>{
					if(status==SyncStatus.CHECKING_FOR_UPDATE)
						this._function.requireLoading('Verificando actualizaciones', 1000);
					if(status==SyncStatus.DOWNLOADING_PACKAGE)
						this._function.requireLoading('Descargando paquetes', 1000);
					if(status==SyncStatus.IN_PROGRESS)
						this._function.requireLoading('En proceso', 1000);
					if(status==SyncStatus.INSTALLING_UPDATE)
						this._function.requireLoading('Instalando actualización', 1000);
					if(status==SyncStatus.UPDATE_INSTALLED)
						this._function.requireLoading('Actualización instalada', 1000);
					if(status==SyncStatus.ERROR)
						this._function.requireLoading('Error', 1000);
				})
			} */
		  //this.darkTheme.checkDarkTheme();
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
