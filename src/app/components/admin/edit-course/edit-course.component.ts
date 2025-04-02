import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { InstructorService } from '../../../services/instructor.service';
import { CoursesService } from '../../../services/courses.service';
import { MessageService } from '../../../services/message.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-course',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.css'
})
export class EditCourseComponent implements OnInit {

  editCourseForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    Price: new FormControl(null, { validators: [Validators.required] }),
    ImageOfCertificate: new FormControl(null, { validators: [Validators.required, this.imageExtensionValidator()] }),
    Category_Id: new FormControl(10, { validators: [Validators.required] }),
    Instructor_Id: new FormControl(1, { validators: [Validators.required] }),
  });

  errorMessage: string = '';
  isLoading: boolean = false;
  categories: any[] = [];
  instructors: any[] = [];
  courseId: number;

  constructor(
    private _coursesService: CoursesService,
    private _Router: Router,
    private _CateService: CategoryService,
    private _InsService: InstructorService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.courseId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    forkJoin({
      categories: this._CateService.getCategories(),
      instructors: this._InsService.getInstructors(),
      course: this._coursesService.getCourseById(this.courseId)
    }).subscribe({
      next: ({ categories, instructors, course }) => {
        this.categories = categories;
        this.instructors = instructors;
        this.editCourseForm.patchValue({
          Name: course.name,
          Description: course.description,
          Price: course.price
        });
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
    return this.editCourseForm.controls;
  }

  onSubmit() {
    if (this.editCourseForm.invalid) {
      this.editCourseForm.markAllAsTouched();
      return;
    }
    this.submitEditCourseForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.editCourseForm.patchValue({ ImageOfCertificate: file });
      this.editCourseForm.get('ImageOfCertificate')?.updateValueAndValidity();
    }
  }

  submitEditCourseForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.editCourseForm.value.Name);
    formData.append('Description', this.editCourseForm.value.Description);
    formData.append('Price', this.editCourseForm.value.Price);
    formData.append('Category_Id', this.editCourseForm.value.Category_Id);
    formData.append('Instructor_Id', this.editCourseForm.value.Instructor_Id);

    const imageFile = this.editCourseForm.get('ImageOfCertificate')?.value;
    if (imageFile instanceof File) {
      formData.append('ImageOfCertificate', imageFile, imageFile.name);
    }

    this._coursesService.editCourse(this.courseId, formData).subscribe({
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
