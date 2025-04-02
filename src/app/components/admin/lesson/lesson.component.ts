import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { SearchService } from '../../../services/search.service';
import { MessageService } from '../../../services/message.service';
import { CoursesService } from '../../../services/courses.service';
import { SearchPipe } from '../../../pipes/search.pipe';

@Component({
  selector: 'app-lesson',
  imports: [CommonModule, RouterLink, SearchPipe],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent implements OnInit {

  courseId : number = 0;

  constructor(private _lessonService: LessonService, private searchService: SearchService,
    private messageService: MessageService, private _router : Router, private _activateR: ActivatedRoute, private _courseSercise : CoursesService
  ) {}

  Lessons: any[] = [];
  searchTerm: string = '';
  message: string | null = null;
  CourseData: any = {};

  ngOnInit(): void {

    this.courseId = Number(this._activateR.snapshot.params['courseid']) || 0;

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

    this.getCourseById();
    this.loadLessons();
  }

  getCourseById(){
    this._courseSercise.getCourseById(this.courseId)
      .subscribe(data => {
        if (data) {
          this.CourseData = data;
        }
      });
  }

  loadLessons() {
    this._lessonService.getAllLessonsByCourseId(this.courseId).subscribe({
      next: (data) => {
        this.Lessons = data;
      },
      error: (err) => {
        console.error('Error fetching lessons:', err);
      }
    });
  }

  deleteLesson(lessonId: number) {
    if (!confirm('Are you sure you want to delete this Lesson?')) return;

    this._lessonService.deleteLesson(lessonId).subscribe({
      next: () => {
        this.messageService.changeMessage('Lesson deleted successfully.');
        this.loadLessons();
      },
      error: (error) => {
        console.error('Error deleting lesson:', error);
      }
    });
  }

}
