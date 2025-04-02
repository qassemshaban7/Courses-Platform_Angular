import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-navbar',
  imports: [ CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isLogin: boolean = false;
  username: string = '';
  imageURL: string = '';
  admin : string = '';

  constructor(private _AuthService : AuthService, private searchService: SearchService) {
  }

  updateSearchTerm(event: any) {
    const value = event.target.value;
    this.searchService.setSearchTerm(value);
  }

  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: (data) => {
        if (data) {
          this.isLogin = true;
          this.username = data.userName;
          if(this.username === 'admin'){
            this.imageURL = '';
            this.admin = 'admin';
          }
          else{
            this.imageURL = data.image;
            this.admin = '';
          }
        } else {
          this.isLogin = false;
          this.username = '';
          this.imageURL = '';
        }
      }
    });
  }

  logout(){
    this._AuthService.signout();
  }

}
