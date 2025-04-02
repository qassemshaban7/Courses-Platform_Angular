import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  userData : any = {};
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userData.subscribe((data) => {
      this.userData = data
    })
  }



}
