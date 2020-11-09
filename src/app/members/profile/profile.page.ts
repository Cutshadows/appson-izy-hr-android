import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavController } from '@ionic/angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { DarkthemeService } from '../../services/darktheme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userInfoItems:any
  currentVal=2;
  darkMode: boolean=false;

  userLoginResDetail: string = 'userLoginResDetail'

  my_profile_page: string = 'assets/img/page/my_profile_page.png'

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public navController: NavController,
	private nativePageTransitions: NativePageTransitions,
	private darkModetheme:DarkthemeService
    ) {
		this.darkMode=this.darkModetheme.checkDarkTheme();
  }

  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
		this.userInfoItems = val
      }
    })
  }
  valDarkMode(){
	this.darkMode=!this.darkMode;
	document.body.classList.toggle('dark');
	}

  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }

  logout() {
    this.authService.logout();
  }

  changepasswordGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'changepassword'])
  }

}
