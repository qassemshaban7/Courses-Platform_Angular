import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private _http: HttpClient, private _CookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    const storedData = this._CookieService.get('userData');

    if (!storedData) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    const parsedData = JSON.parse(storedData);
    if (parsedData && parsedData.token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parsedData.token}`,
      });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getCategories(): Observable<any> {
    return this._http.get(`${environment.baseURL}categories/getallcategory`);
  }

  addCategory(credentials: { name: string }): Observable<any> {
    return this._http.post(
      `${environment.baseURL}categories/addcategory`,
      credentials,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json'}
    );
  }

  editCategory( id : number, credentials: { name: string }): Observable<any> {
    return this._http.put(
      `${environment.baseURL}categories/updatecategory/${id}`,
      credentials,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json'}
    );
  }

  deleteCategory(categoryId: number): Observable<string> {
    return this._http.delete(`${environment.baseURL}categories/deletecategory/${categoryId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'text',
      observe: 'body'
    });
  }

}
