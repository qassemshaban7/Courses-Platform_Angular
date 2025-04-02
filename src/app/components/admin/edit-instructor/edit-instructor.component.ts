import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { InstructorService } from '../../../services/instructor.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-instructor',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit-instructor.component.html',
  styleUrl: './edit-instructor.component.css'
})
export class EditInstructorComponent implements OnInit {
  editInstructorForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    Imageprofile : new FormControl(null, { validators: [Validators.required, this.imageExtensionValidator()] }),
  });

  isLoading: boolean = false;
  errorMessage: string = '';
  instructorId: number;

  constructor(
    private _InsService: InstructorService,
    private _Router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.instructorId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadInstructorData();
  }

  get f() {
    return this.editInstructorForm.controls;
  }

  loadInstructorData() {
    this._InsService.getInstructorById(this.instructorId).subscribe({
      next: (data) => {
        this.editInstructorForm.patchValue({
          Name: data.name,
          Description: "Instructor Description",
        });
      },
      error: (err) => {
        console.error('Error fetching instructor data:', err);
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

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.editInstructorForm.patchValue({ Imageprofile: file });
      this.editInstructorForm.get('Imageprofile')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.editInstructorForm.invalid) {
      this.editInstructorForm.markAllAsTouched();
      return;
    }
    this.submitEditInstructorForm();
  }

  submitEditInstructorForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.editInstructorForm.value.Name);
    formData.append('Description', this.editInstructorForm.value.Description);

    const imageFile = this.editInstructorForm.get('Imageprofile')?.value;
    if (imageFile instanceof File) {
      formData.append('Imageprofile', imageFile, imageFile.name);
    }

    this._InsService.editInstructor(this.instructorId, formData).subscribe({
      next: (response) => {
        this.messageService.changeMessage(response);
        this.isLoading = false;
        this._Router.navigate(['/admin/instructors']);
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
