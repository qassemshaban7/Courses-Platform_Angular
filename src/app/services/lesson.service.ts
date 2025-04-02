import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  userId: string = '';

  constructor(private _clint: HttpClient, private _auth: AuthService, private _CookieService: CookieService) {
    this._auth.userData.subscribe({
      next: (data) => {
        if (data) {
          this.userId = data.userId;
        }
      }
    });
  }

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

  getAllLessonsByCourseId(courseId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}Lesson/GetVideosForCourse/${courseId}`);
  }

  getLessonById(lessonId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}Lesson/PlayVideoForLesson/${lessonId}?userId=${this.userId}`);
  }

  addLesson(formData: any): Observable<any> {
    return this._clint.post(`${environment.baseURL}Lesson/addlesson`, formData, {
      headers: this.getAuthHeaders() , responseType: 'text' as 'json'
    });
  }

  editLesson( lessonId : number,formData: any): Observable<any> {
    return this._clint.put(`${environment.baseURL}Lesson/updatelesson/${lessonId}`, formData,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' });
  }

  deleteLesson( lessonId : number): Observable<any> {
    return this._clint.delete(`${environment.baseURL}Lesson/deletelesson/${lessonId}`,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' });
  }
}
