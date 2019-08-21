import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
//import { BehaviourSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  database: SQLiteObject;

  constructor(
    public http: HttpClient,
    ) {

  }

}
