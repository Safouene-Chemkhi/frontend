import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { API_URL } from 'src/environments/environment';
import { NavController } from '@ionic/angular';


const oauthApiUrl = API_URL+'/users';
const loginApiUrl = API_URL+'/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_token :string;
  constructor(private http: HttpClient, public nav : NavController) { }
  
  login(credentials){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(loginApiUrl, (credentials), {headers: headers})
  }

  register(user){
    console.log(JSON.stringify(user));
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(oauthApiUrl, user, {headers: headers})
  }

  update(user){
    console.log('updating user');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-auth-token':localStorage.getItem('token')});
    return this.http.post(oauthApiUrl+'/'+user._id, user, {headers: headers})
    
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
