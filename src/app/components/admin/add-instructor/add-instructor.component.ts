import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InstructorService } from '../../../services/instructor.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-add-instructor',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-instructor.component.html',
  styleUrl: './add-instructor.component.css'
})
export class AddInstructorComponent implements OnInit {

  addInstructorForm: FormGroup = new FormGroup({
    Name: new FormControl(null, { validators: [Validators.required] }),
    Description: new FormControl(null, { validators: [Validators.required] }),
    Imageprofile: new FormControl(null, { validators: [Validators.required, this.imageExtensionValidator()] }),
  });

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private _InsService: InstructorService,
    private _Router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

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
    return this.addInstructorForm.controls;
  }

  onSubmit() {
    if (this.addInstructorForm.invalid) {
      this.addInstructorForm.markAllAsTouched();
      return;
    }
    this.submitAddInstructorsForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.addInstructorForm.patchValue({ Imageprofile: file });
      this.addInstructorForm.get('Imageprofile')?.updateValueAndValidity();
    }
  }

  submitAddInstructorsForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Name', this.addInstructorForm.value.Name);
    formData.append('Description', this.addInstructorForm.value.Description);

    const imageFile = this.addInstructorForm.get('Imageprofile')?.value;
    if (imageFile instanceof File) {
      formData.append('Imageprofile', imageFile, imageFile.name);
    }

    this._InsService.addInstructor(formData).subscribe({
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
