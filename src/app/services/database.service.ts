import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { delay, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

//import { BehaviourSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  response:any;
  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization":"BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  constructor(public http: HttpClient,){}
  validateLogin(url, params){
    let Promesa=new Promise((resolve)=>{
      this.http.post(url, params, this.header).pipe(
        timeout(2500),
        catchError(
          error=>of(408)
          )
        ).subscribe((response)=>{
        let jsonRespond={
          status,
          response
        }
        if(response && response['status']==1){
          jsonRespond.status="200";
          jsonRespond.response=response;
          this.response=jsonRespond;
          resolve(jsonRespond);
        }else if(response && response['status']==0){
          jsonRespond.status="400";
          jsonRespond.response=response;
          this.response=jsonRespond;
          resolve(this.response);
        }
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }
  serviceEmployeeScheduleList(url){
    let Promesa=new Promise((resolve)=>{
      this.http.get(url, this.header).pipe(
        delay(450)
        ).subscribe((response)=>{
        let jsonRespond={
          status,
          response
        }
        if(response){
          jsonRespond.status="200";
          jsonRespond.response=response;
          resolve(jsonRespond);
        }else if(!response){
          jsonRespond.status="400";
          jsonRespond.response=response;
          resolve(jsonRespond);
        }
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }
  serviceViewEvents(url){
    let Promesa=new Promise((resolve)=>{
      this.http.get(url, this.header).pipe(
        delay(450)
        ).subscribe((response)=>{
        let jsonRespondEvents={
          status,
          response
        }
        if((Object.keys(response).length != 0)==true){
          jsonRespondEvents.status="200";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        }else if((Object.keys(response).length == 0)==true){
          jsonRespondEvents.status="400";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        }
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }
  serviceMarkEmployeed(url){
    let Promesa=new Promise((resolve)=>{
      this.http.get(url, this.header).pipe(
        delay(450)
        ).subscribe((response)=>{
        let jsonRespondEvents={
          status,
          response
        }
        if((Object.keys(response).length != 0)==true){
          jsonRespondEvents.status="200";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        }else if((Object.keys(response).length == 0)==true){
          jsonRespondEvents.status="400";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        }
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }
  serviceChangePassword(url, params){
    let Promesa=new Promise((resolve)=>{
      this.http.post(url, params, this.header).pipe(
        delay(450)
        ).subscribe((response)=>{
        let jsonChangPassword={
          status,
          response
        }
        switch(response['status']){
          case 1:
            jsonChangPassword.status="200";
            jsonChangPassword.response=response;
            resolve(jsonChangPassword);
          break;
          case 0:
            jsonChangPassword.status="400";
            jsonChangPassword.response=response;
            resolve(jsonChangPassword);
          break;
        }
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }
  serviceGetCasino(url){
    let Promesa=new Promise((resolve)=>{
      this.http.get(url, this.header).pipe(
        delay(450)
        ).subscribe((response)=>{
          console.log("response de casinos"+response['Data']);
          debugger
        /* let jsonRespondEvents={
          status,
          response
        } */
        /* if((Object.keys(response).length != 0)==true){
          jsonRespondEvents.status="200";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        }else if((Object.keys(response).length == 0)==true){
          jsonRespondEvents.status="400";
          jsonRespondEvents.response=response;
          resolve(jsonRespondEvents);
        } */
      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                if (error.hasOwnProperty(key)) {
                  const element = error[key];
                  if(element==0){
                    let jsonResponseError={
                      status
                    }
                    jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
                  }
                } 
              break;
          }
        }
      });
    })
    return Promesa;
  }

}
  