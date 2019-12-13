import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
const introduccion_key='introduccion-key';

@Injectable({
  providedIn: 'root'
})
export class IntroductionService {
  introduccion={
    mostrar_tutorial:true
  }
  constructor(public storage: Storage) { }
    cargar_storage(){
      let promesa= new Promise((resolve)=>{
          this.storage.ready()
          .then(()=>{
             this.storage.get(introduccion_key)
             .then(intro=>{
               if(intro){
                 this.introduccion=intro;
                }
                resolve();
             });
          })
        });
        return promesa;
    }
    guardar_storage(){
        this.storage.ready()
        .then(()=>{
          this.storage.set(introduccion_key, this.introduccion);
        })

    }
  }
