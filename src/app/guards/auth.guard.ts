import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _Router = inject(Router);
  private _CookieService = inject(CookieService);

  userData = new BehaviorSubject<any>(null);

  canActivate(): Observable<boolean> {
    if (typeof window === 'undefined') {
      return of(false);
    }

    const storedData = this._CookieService.get('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (this.isValidToken(parsedData.token)) {
        this.userData.next(parsedData);
        return of(true);
      }
    }

    setTimeout(() => {
      this._Router.navigate(['/login']);
    }, 0);

    return of(false);
  }

  private isValidToken(token: string): boolean {
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
}
