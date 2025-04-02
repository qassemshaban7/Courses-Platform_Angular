import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { SearchPipe } from '../../../pipes/search.pipe';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchPipe],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  constructor(private _courseService: CoursesService, private searchService: SearchService,
    private messageService: MessageService, private _router : Router
  ) {}

  Courses: any[] = [];
  searchTerm: string = '';
  message: string | null = null;

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.messageService.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message) {
        setTimeout(() => {
          this.messageService.clearMessage();
        }, 5000);
      }
    });

    this.loadCourses();
  }

  loadCourses() {
    this._courseService.getAllCourses().subscribe({
      next: (data) => {
        this.Courses = data;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      }
    });
  }

  deleteCourse(courseId: number) {
    if (!confirm('Are you sure you want to delete this Course?')) return;

    this._courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.messageService.changeMessage('Course deleted successfully.');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Error deleting course:', error);
      }
    });
  }

}
