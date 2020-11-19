import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { delay, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventSubmitService {
	response:any;
	header: any = {
	  "headers": {
		"Content-Type": "application/json",
		"Authorization":"BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
	  }
	}
  constructor(private http:HttpClient) { }

  sumbitEvent(url, params){
    let Promesa=new Promise((resolve)=>{
	  	this.http.post(url, params, this.header)
	  		.pipe(
        		delay(450),
				timeout(10000),
				/* catchError(
					  error=>of(408)
				) */
        	).subscribe((response)=>{
        	let jsonRespondEvents={
        	  status,
        	  response
			}
			if(response==null){
				jsonRespondEvents.status="200";
				jsonRespondEvents.response=response;
				this.response=jsonRespondEvents;
				resolve(this.response)
			}

      },
      (error: HttpErrorResponse)=>{
        for (const key in error) {
          switch(key){
             case 'status':
                  const element = error[key];
                if(element==0){
                    let jsonResponseError={
					  status
                    }
					jsonResponseError.status="0";
                    this.response=jsonResponseError;
                    resolve(this.response);
				}else if (element===473) {
						  let jsonResponseError={
							status
						  }
						  jsonResponseError.status=`${473}`;
						  this.response=jsonResponseError;
						  resolve(this.response);
				}
              break;
          }
        }
      });
    })
    return Promesa;
  }
}
