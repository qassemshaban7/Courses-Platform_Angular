import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-lesson',
  imports: [CommonModule],
  templateUrl: './show-lesson.component.html',
  styleUrl: './show-lesson.component.css'
})
export class ShowLessonComponent {
  lessonId: number = 0;
  courseId: number = 0;
  LessonData: any = {};
  errorMessage: string = '';
  constructor(private _route: ActivatedRoute, private _lessonService: LessonService) { }

  ngOnInit(): void {
    this.lessonId = Number(this._route.snapshot.params['id']) || 0;
    this.courseId = Number(this._route.snapshot.params['courseId']) || 0;

      this._lessonService.getLessonById(this.lessonId).subscribe({
        next: (response) => {
          if (response) {
            this.LessonData = response;
          }
        },
        error: (error) => {
          if (error.error) {
            if (typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error.errors) {
              this.errorMessage = Object.values(error.error.errors).flat().join(' ');
            }
          }
        }
      });

  }

}
