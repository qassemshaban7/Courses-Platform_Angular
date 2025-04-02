import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { CommonModule } from '@angular/common';
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {

  courseId: number = 0;
  favorite: boolean = false;
  vote: number = 0;
  voteValue : number = 0;
  CourseData: any = {};
  instructorsData: any = {};
  LessonsData: any[] = [];
  successMessage : string = 'Vote added successfully.';


  constructor(private _route: ActivatedRoute, private _courseService: CoursesService,
    private _lessonService : LessonService
  ) { }

  ngOnInit(): void {
    this.courseId = Number(this._route.snapshot.params['id']) || 0;
    this.favorite = this._route.snapshot.params['fav'] === 'true';
    this.vote = Number(this._route.snapshot.params['vote']) || 0;

    this._courseService.getCourseById(this.courseId)
      .subscribe(data => {
        if (data) {
          this.CourseData = data;
        }
      });

    this._courseService.getInstructorsbyCourseId(this.courseId)
      .subscribe(data => {
        if (Array.isArray(data) && data.length > 0) {
          this.instructorsData = data[0];
        }
      });

    this._lessonService.getAllLessonsByCourseId(this.courseId)
    .subscribe({
      next: (data) => {
        this.LessonsData = data;
      },
      error: (err) => {
        alert(err.error?.message || err.message || "An error occurred while fetching lessons.");
      }
    });
  }

  setVote(value: number) {
    this.voteValue = value;
    this._courseService.AddVote(this.courseId, value).subscribe(
      (response: any) => {
        if (response) {
          window.alert(response.text || this.successMessage);
        }
      },
      (error: { error: any }) => {
        window.alert(error.error?.message || JSON.stringify(error.error));
      }
    );
  }


  stars(voteRate: number): number[] {
    return Array.from({ length: voteRate }, (_, i) => i);
  }

  addToFavorite() {
    this._courseService.addCourseToFav(this.courseId).subscribe(() => {
      if (this.CourseData) {
        this.favorite = true;
      }
    });
  }

  deleteFromFavorite() {
    this._courseService.deleteCourseFromFav(this.courseId).subscribe(() => {
      if (this.CourseData) {
        this.favorite = false;
      }
    });
  }
}
