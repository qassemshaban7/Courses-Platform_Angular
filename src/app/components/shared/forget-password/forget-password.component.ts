import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ForgetPasswordService } from '../../../services/forget-password.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordForm: FormGroup = new FormGroup(
    {
      newPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()] }),
      confirmNewPassword: new FormControl(null, { validators: [Validators.required]}),
    },
    { validators: this.passwordMatchValidator }
  );

  errorMessage: string = '';
  isLoading :boolean = false;
  email: string = '';


  passwordVisible: boolean = false;
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  confirmPasswordVisible: boolean = false;
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  constructor(private _forgetpassService: ForgetPasswordService,
    private _Router : Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.email = this._route.snapshot.params['email'];
  }

  get f() {
    return this.forgetPasswordForm.controls;
  }


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
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }


  onSubmit() {
    if (this.forgetPasswordForm.invalid) {
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }
    this.submitVerifyForm();
  }

  submitVerifyForm() {
    this.isLoading = true;
    const pinData = {
      newPassword: this.forgetPasswordForm.value.newPassword,
      confirmNewPassword: this.forgetPasswordForm.value.confirmNewPassword,
    };

    this._forgetpassService.ForgetPassword( this.email, pinData).subscribe({
      next: (response) => {
        this.isLoading = false;
        window.alert('Your Password Changed Successfully, Login Now!');
        this._Router.navigate([`/login`]);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404 || error.status === 400) {
          this.errorMessage = error.errorMessage;
        }
      }
    });
  }

}
