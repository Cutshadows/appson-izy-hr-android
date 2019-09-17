import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';


//import { BehaviourSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  constructor(public http: HttpClient,){}
  validateLogin(url, params){
    let Promesa=new Promise((resolve, reject)=>{
      this.http.post(url, params, this.header).subscribe((response)=>{
        console.log(response);
      },
      (error)=>{
        console.log(error);
      })
    })
    return Promesa;
    
  }
}
  