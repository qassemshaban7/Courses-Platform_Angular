import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-edit-lesson',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-lesson.component.html',
  styleUrl: './edit-lesson.component.css'
})
export class EditLessonComponent implements OnInit {

  editLessonForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    VideoFile : new FormControl(null, { validators: [Validators.required, this.videoExtensionValidator()] }),
  });

  errorMessage: string = '';
  isLoading: boolean = false;
  lessonId: number;
  courseId: number;

  constructor(
    private _lessonService: LessonService,
    private _Router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.lessonId = this.route.snapshot.params['id'];
    this.courseId = this.route.snapshot.params['courseId'];
  }

  ngOnInit(): void {
    this._lessonService.getLessonById(this.lessonId).subscribe({
      next: (data) => {
        this.editLessonForm.patchValue({
          Name: data.lessonName,
          Description: "Lesson Description",
        });
      },
      error: (err) => console.error("Error fetching lesson:", err),
    });
  }


  videoExtensionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      if (file instanceof FileList && file.length > 0) {
        const fileName = file[0].name.toLowerCase();
        return fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mkv') ? null : { invalidVideoType: true };
      }

      return null;
    };
  }

  get f() {
    return this.editLessonForm.controls;
  }

  onSubmit() {
    if (this.editLessonForm.invalid) {
      this.editLessonForm.markAllAsTouched();
      return;
    }
    this.submitEditLessonForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.editLessonForm.patchValue({ VideoFile: file });
      this.editLessonForm.get('VideoFile')?.updateValueAndValidity();
    }
  }

  submitEditLessonForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.editLessonForm.value.Name);
    formData.append('Description', this.editLessonForm.value.Description);
    formData.append('CourseId', this.courseId.toString());

    const imageFile = this.editLessonForm.get('VideoFile')?.value;
    if (imageFile instanceof File) {
      formData.append('VideoFile', imageFile, imageFile.name);
    }

    this._lessonService.editLesson(this.lessonId, formData).subscribe({
      next: (response) => {
        this.messageService.changeMessage(response);
        this.isLoading = false;
        this._Router.navigate([`/admin/lessons/${this.courseId}`]);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error && error.error.errors) {
          this.errorMessage = Object.entries(error.error.errors)
            .map(([key, messages]) => `${key}: ${(messages as string[]).join(' | ')}`)
            .join(' | ');
        }
      }
    });
  }
}
