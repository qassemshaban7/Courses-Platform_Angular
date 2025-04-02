import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userData.pipe(
      take(1),
      map(user => !!user && this.authService.isAdmin()),
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/home']);
        }
      })
    );
  }
}
