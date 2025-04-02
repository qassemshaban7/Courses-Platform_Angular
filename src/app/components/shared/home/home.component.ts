import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeemorePipe } from '../../../pipes/seemore.pipe';
import { SearchPipe } from '../../../pipes/search.pipe';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,SearchPipe, RouterLink, SeemorePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private _courseService: CoursesService, private searchService: SearchService){}

  Categories : any [] = [];
  Courses : any [] = [];
  selectedCategoryId : number | null = null;
  searchTerm: string = '';

  categoryColors: string[] = [
    "#008080", "#800080", "#FF5733", "#2ECC71", "#FFD700", "#3498DB"
  ];

  ngOnInit(): void {
    this._courseService.getCategories().subscribe({
      next :(data) =>{
        this.Categories = data
      }
    })

    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.loadCourses();
  }

  loadCourses(): void {
    if (this.selectedCategoryId) {
      this._courseService.getCoursesbyCategoryId(this.selectedCategoryId).subscribe({
        next :(data) =>{
          this.Courses = data
        }
      })
    }
    else{
      this._courseService.getAllCourses().subscribe({
        next :(data) =>{
          this.Courses = data
        }
      })
    }
  }

  ChangeCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.loadCourses();
  }

  stars(vote: number) {
    return new Array(vote);
  }

  toggleFavorite(course: any) {
    course.favorate = !course.favorate;
  }

  getCategoryColor(index: number): string {
    return this.categoryColors[index % this.categoryColors.length];
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
