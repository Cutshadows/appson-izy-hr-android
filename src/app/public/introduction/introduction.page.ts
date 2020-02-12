import { Component, OnInit } from '@angular/core';
import { IntroductionService } from '../../services/introduction.service';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class Introduction implements OnInit {
  slides:any[] = [
    {
      title: "¡Bienvenido!",
      description: "",
      image: "assets/img/introduction/ica-slidebox-img-0.png",
    },
    {
      title: "Marca desde tu dispositivo",
      description: "<b>IZY HR TEAM, entrega la posibilidad de realizar marcas de ingreso, entrada de colación, salida de colación y salida a través del dispositivo móvil entregando una mayor facilidad al colaborador.</b>",
      image: "assets/img/introduction/ica-slidebox-img-1.png",
	},
	{
		title: "Notificación de marcas",
		description: "<b>Cada cierto tiempo se enviará una notificación al colaborador si se encuentra con el tiempo accedido para marcar.</b>",
		image: "assets/img/introduction/ica-slidebox-img-2.png",
	  },
	  {
		title: "Control de marcas",
		description: "<b>El colaborador tendra a disposición el control de marcas que ha realizado durante los últimos días.</b>",
		image: "assets/img/introduction/ica-slidebox-img-3.png",
	  },
    {
      title: "Control de horarios y eventos",
      description: "<b>IZY HR TEAM, permite al colaborador revisar el horario y calendario que tiene para la semana, además de revisar si tiene algún evento programado y el estado en que se encuentra.</b>",
      image: "assets/img/introduction/ica-slidebox-img-4.png",
    },

  ];
  slidesOpts = {
    initialSlide: 0,
    speed: 400
  };
	constructor(private _tutorial:IntroductionService,
		public navController: NavController) { }

  ngOnInit() {
  }
  saltar_tutorial(){
    this._tutorial.introduccion.mostrar_tutorial=false;
    this._tutorial.guardar_storage();
	this.navController.navigateRoot(['login']);
  }

}
