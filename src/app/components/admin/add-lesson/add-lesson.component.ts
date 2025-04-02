import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LessonService } from '../../../services/lesson.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-add-lesson',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-lesson.component.html',
  styleUrl: './add-lesson.component.css'
})
export class AddLessonComponent implements OnInit {

  addLessonForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    VideoFile : new FormControl(null, { validators: [Validators.required, this.videoExtensionValidator()] }),
  });

  courseId : number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(
    private _lessonService: LessonService,
    private _Router: Router,
    private messageService: MessageService,
    private _activateR: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this._activateR.snapshot.params['courseid']) || 0;
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
    return this.addLessonForm.controls;
  }

  onSubmit() {
    if (this.addLessonForm.invalid) {
      this.addLessonForm.markAllAsTouched();
      return;
    }
    this.submitAddLessonForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.addLessonForm.patchValue({ VideoFile: file });
      this.addLessonForm.get('VideoFile')?.updateValueAndValidity();
    }
  }

  submitAddLessonForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.addLessonForm.value.Name);
    formData.append('Description', this.addLessonForm.value.Description);
    formData.append('CourseId', this.courseId.toString());

    const imageFile = this.addLessonForm.get('VideoFile')?.value;
    if (imageFile instanceof File) {
      formData.append('VideoFile', imageFile, imageFile.name);
    }

    this._lessonService.addLesson(formData).subscribe({
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
