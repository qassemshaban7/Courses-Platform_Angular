import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { InstructorService } from '../../../services/instructor.service';
import { CoursesService } from '../../../services/courses.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent implements OnInit {

  addCourseForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    Price: new FormControl(null, { validators: [Validators.required] }),
    ImageOfCertificate: new FormControl(null, { validators: [Validators.required, this.imageExtensionValidator()] }),
    Category_Id: new FormControl('', { validators: [Validators.required] }),
    Instructor_Id: new FormControl('', { validators: [Validators.required] }),
  });

  errorMessage: string = '';
  isLoading: boolean = false;
  categories: any[] = [];
  instructors: any[] = [];

  constructor(
    private _coursesService: CoursesService,
    private _Router: Router,
    private _CateService: CategoryService,
    private _InsService: InstructorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    forkJoin({
      categories: this._CateService.getCategories(),
      instructors: this._InsService.getInstructors()
    }).subscribe({
      next: ({ categories, instructors }) => {
        this.categories = categories;
        this.instructors = instructors;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  imageExtensionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      if (file instanceof FileList && file.length > 0) {
        const fileName = file[0].name.toLowerCase();
        return fileName.endsWith('.jpg') || fileName.endsWith('.png') ? null : { invalidImageType: true };
      }

      return null;
    };
  }

  get f() {
    return this.addCourseForm.controls;
  }

  onSubmit() {
    if (this.addCourseForm.invalid) {
      this.addCourseForm.markAllAsTouched();
      return;
    }
    this.submitAddCourseForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.addCourseForm.patchValue({ ImageOfCertificate: file });
      this.addCourseForm.get('ImageOfCertificate')?.updateValueAndValidity();
    }
  }

  submitAddCourseForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.addCourseForm.value.Name);
    formData.append('Description', this.addCourseForm.value.Description);
    formData.append('Price', this.addCourseForm.value.Price);
    formData.append('Category_Id', this.addCourseForm.value.Category_Id);
    formData.append('Instructor_Id', this.addCourseForm.value.Instructor_Id);

    const imageFile = this.addCourseForm.get('ImageOfCertificate')?.value;
    if (imageFile instanceof File) {
      formData.append('ImageOfCertificate', imageFile, imageFile.name);
    }

    this._coursesService.addCourse(formData).subscribe({
      next: (response) => {
        this.messageService.changeMessage(response);
        this.isLoading = false;
        this._Router.navigate(['/admin/courses']);
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
