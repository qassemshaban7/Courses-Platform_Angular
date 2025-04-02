import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup(
    {
      Email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      userName: new FormControl(null, { validators: [Validators.minLength(5), Validators.required] }),
      Password: new FormControl(null, { validators: [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()] }),
      ConfirmPassword: new FormControl(null, { validators: [Validators.required]}),
      Image: new FormControl(null, { validators: [Validators.required, this.imageExtensionValidator()] }),
    },
    { validators: this.passwordMatchValidator }
  );

  errorMessage: string = '';
  isLoading :boolean = false;

  passwordVisible: boolean = false;
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  confirmPasswordVisible: boolean = false;
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  constructor(private _authService: AuthService,
    private _Router : Router
  ) {}

  ngOnInit(): void {}

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const hasLowerCase = /[a-z]/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasDigit = /[0-9]/.test(value);
      const hasSpecialChar = /[@%$#]/.test(value);

      return hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar ? null : { passwordStrength: true };
    };
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
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
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.submitRegistrationForm();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.registerForm.patchValue({ Image: file });
      this.registerForm.get('Image')?.updateValueAndValidity();
    }
  }

  submitRegistrationForm()
  {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('Email', this.registerForm.value.Email);
    formData.append('userName', this.registerForm.value.userName);
    formData.append('Password', this.registerForm.value.Password);
    formData.append('ConfirmPassword', this.registerForm.value.ConfirmPassword);

    const imageFile = this.registerForm.get('Image')?.value;
    if (imageFile instanceof File) {
      formData.append('Image', imageFile);
    }

    this._authService.signup(formData).subscribe({
      next: (response) => {
        if(response.message === 'Account added successfully'){
          this.isLoading = false;
          window.alert('Your Account added Successfully, Login Now!');
          this._Router.navigate(['/login']);
        }
      },
      error: (error) => {
        if (error.error) {
          this.isLoading = false;
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
