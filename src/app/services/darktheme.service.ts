import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkthemeService {

  constructor() { }
  checkDarkTheme(){
	const preferDarkMode=window.matchMedia('(prefers-color-scheme:dark)');
	if(preferDarkMode.matches){
		document.body.classList.toggle('dark');
		return true;
	}
	return false;
  }
}
