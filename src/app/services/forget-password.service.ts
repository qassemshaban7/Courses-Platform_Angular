import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private _HttpClient: HttpClient) { }

  SendPinCode(credentials: { email: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._HttpClient.post(`${environment.baseURL}User/send_reset_code`, credentials, { headers });
  }

  Verify_Pin( email : string, credentials: { pin: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._HttpClient.post(`${environment.baseURL}User/verify_pin/${email}`, credentials, { headers });
  }

  ForgetPassword( email : string, credentials: { newPassword: string, confirmNewPassword: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._HttpClient.post(`${environment.baseURL}User/forget_password/${email}`, credentials, { headers });
  }

}
