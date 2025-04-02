import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { RouterLink } from '@angular/router';
import { SeemorePipe } from '../../../pipes/seemore.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-favourite',
  imports: [CommonModule,SearchPipe, RouterLink, SeemorePipe],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css'
})
export class FavouriteComponent implements OnInit {

  constructor(private _courseService: CoursesService, private searchService: SearchService){}

  Courses : any [] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.loadCourses();
  }

  loadCourses(): void {
    this._courseService.getAllCourses().subscribe({
      next: (data) => {
        this.Courses = data.filter((course: { favorate: boolean; }) => course.favorate === true);
      },
      error: (err) => {
        console.error("Error loading courses:", err);
      }
    });
  }

  stars(vote: number) {
    return new Array(vote);
  }

  toggleFavorite(course: any) {
    course.favorate = !course.favorate;
  }

  addToFavorite(courseId: number) {
    this._courseService.addCourseToFav(courseId).subscribe(() => {
      const course = this.Courses.find(c => c.id === courseId);
      if (course) {
        course.favorate = true;
      }
    });
  }

  deleteFromFavorite(courseId: number) {
    this._courseService.deleteCourseFromFav(courseId).subscribe(() => {
      const course = this.Courses.find(c => c.id === courseId);
      if (course) {
        course.favorate = false;
      }
    });
  }

}

