import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {FunctionsService} from '../app/services/functions.service';
import {IntroductionService} from '../app/services/introduction.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
	fcmMessage:any;
	fcmTitle:any;
	logoUrl='assets/img/logo.png';
	fcmToken:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private storage: Storage,
    public navController: NavController,
	private fcm:FCM,
	private localNotifications:LocalNotifications,
	private _function:FunctionsService,
	private _tutorial:IntroductionService,
	private toastController:ToastController
  ) {
	this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
		this._tutorial.cargar_storage()
		.then(()=>{
			if(this._tutorial.introduccion.mostrar_tutorial){
			this.navController.navigateRoot(['Introduction']);
			}else{
			this.navController.navigateRoot(['login']);
			}
		});
		this.authService.authenticationState.subscribe(state => {
			if(state) {
			  this.navController.navigateRoot(['members', 'dashboard'])
			} else {

			  this.navController.navigateRoot(['login'])
			}
		  });

		this.statusBar.styleDefault();
		this.splashScreen.hide();

				this.fcm.getAPNSToken()
				.then((tokenApn)=>{
				}).catch(error=>{
				})
					this.fcm.getToken().then(token => {
						this.fcmToken = token;
					  });
					this.fcm.onNotification()
					.subscribe(async (notification) => {
						this.fcmTitle = notification.title;
						this.fcmMessage = notification.body;
						if(notification.wasTapped){
						}else{
							let toastNotification= await this.toastController.create({
								header: notification.title,
								message: notification.body,
								position: 'top',
								buttons: [
									{
									side: 'start',
									icon: 'star',
									text: 'Aceptar',
									handler: () => {
										console.log('Favorite clicked');
									}
									}
								]
							})
							toastNotification.present();
						 // this.localNotificationFcm(this.fcmTitle, this.fcmMessage);
						}
					  });
					  this.fcm.onTokenRefresh().subscribe(token => {
						this.storage.set('deviceFcmToken', token);
						this.fcmToken = token;
					  });

	});
  }
  localNotificationFcm(fcmTitle, fcmMessage) {
			this.localNotifications.schedule({
				title:fcmTitle,
				text:fcmMessage,
				vibrate:true,
				foreground:true,
				icon:this.logoUrl
			});
	  }
}
