import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private _clint: HttpClient, private _auth: AuthService, private _CookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    const storedData = this._CookieService.get('userData');

    if (!storedData) {
      return new HttpHeaders();
    }

    const parsedData = JSON.parse(storedData);
    if (parsedData && parsedData.token) {
      return new HttpHeaders({
        Authorization: `Bearer ${parsedData.token}`,
      });
    }
    return new HttpHeaders();
  }

  getInstructors(): Observable<any> {
    return this._clint.get(`${environment.baseURL}Instructor/instructors`);
  }

  getInstructorById(InstructorId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}Instructor/${InstructorId}/instructor`, {
      headers: this.getAuthHeaders()
    });
  }

  addInstructor(formData: FormData): Observable<any> {
    return this._clint.post(`${environment.baseURL}Instructor/add`, formData, {
      headers: this.getAuthHeaders() , responseType: 'text' as 'json'
    });
  }

  editInstructor(InstructorId: number, formData: FormData): Observable<any> {
    return this._clint.put(`${environment.baseURL}Instructor/update/${InstructorId}`, formData, {
      headers: this.getAuthHeaders() , responseType: 'text' as 'json'
    });
  }

  deleteInstructor(InstructorId: number): Observable<any> {
    return this._clint.delete(`${environment.baseURL}Instructor/delete/${InstructorId}`, {
      headers: this.getAuthHeaders() , responseType: 'text' as 'json'
    });
  }
}
