import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

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

  getCoursesbyCategoryId(CategoryId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}courses/getCoursesByCategoryId?CategoryId=${CategoryId}&userId=${this.userId}`);
  }

  getAllCourses(): Observable<any> {
    return this._clint.get(`${environment.baseURL}courses/getallcourses?userId=${this.userId}`);
  }

  getCategories(): Observable<any> {
    return this._clint.get(`${environment.baseURL}categories/getallcategory`);
  }

  getCourseById(courseId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}courses/getcoursebID/${courseId}?userId=${this.userId}`);
  }

  getInstructorsbyCourseId(courseId: number): Observable<any> {
    return this._clint.get(`${environment.baseURL}courses/getallinstructorinsideonecourse/${courseId}`);
  }

  addCourseToFav(courseId: number): Observable<any> {
    const credentials = { courseId, userId: this.userId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._clint.post(`https://learningplatformv1.runasp.net/AddCourseTOFavList`,
      credentials, { headers, responseType : 'text' });
  }

  deleteCourseFromFav(courseId: number): Observable<any> {
    return this._clint.delete(`https://learningplatformv1.runasp.net/deletefromFav?courseId=${courseId}&userId=${this.userId}`,
      { responseType : 'text' });
  }

  AddVote(courseId: number, value: number) {
    const credentials = { value };

    return this._clint.post(
      `${environment.baseURL}Vote/AddVoteForCourse?courseId=${courseId}&userId=${this.userId}`,
      credentials,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  addCourse(formData: any): Observable<any> {
    return this._clint.post(`${environment.baseURL}courses/addcourse`, formData, {
      headers: this.getAuthHeaders() , responseType: 'text' as 'json'
    });
  }

  editCourse( courseId : number,formData: any): Observable<any> {
    return this._clint.put(`${environment.baseURL}courses/updatecourse/${courseId}`, formData,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' });
  }

  deleteCourse( courseId : number): Observable<any> {
    return this._clint.delete(`${environment.baseURL}courses/deletecourse/${courseId}`,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' });
  }

}
