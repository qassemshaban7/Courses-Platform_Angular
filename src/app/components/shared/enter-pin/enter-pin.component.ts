import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgetPasswordService } from '../../../services/forget-password.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-enter-pin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './enter-pin.component.html',
  styleUrl: './enter-pin.component.css'
})
export class EnterPinComponent implements OnInit {

  verifyPinCodeForm: FormGroup = new FormGroup(
    {
      pin: new FormControl(null, { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)] }),
    },
  );

  errorMessage: string = '';
  isLoading :boolean = false;
  email: string = '';
  expireAt: string = '';

  constructor(private _forgetpassService: ForgetPasswordService,
    private _Router : Router, private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.email = this._route.snapshot.params['email'];
    this.expireAt = this._route.snapshot.params['expireAt'];
  }

  get f() {
    return this.verifyPinCodeForm.controls;
  }

  onSubmit() {
    if (this.verifyPinCodeForm.invalid) {
      this.verifyPinCodeForm.markAllAsTouched();
      return;
    }
    this.submitVerifyForm();
  }

  submitVerifyForm() {
    this.isLoading = true;
    const pinData = {
      pin: this.verifyPinCodeForm.value.pin,
    };

    this._forgetpassService.Verify_Pin( this.email, pinData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this._Router.navigate([`/forgetpassword/${this.email}`]);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404 || error.status === 400) {
          this.errorMessage = error.errorMessage;
        }
      }
    });
  }

  ResndCode(){
    const sendPinData = {
      email: this.email,
    };

    this._forgetpassService.SendPinCode(sendPinData).subscribe({
      next: (response) => {
        this.isLoading = false;
        window.alert('A code has been sent to you. Check your email now.')
        this._Router.navigate([`/enterpin/${response.email}/${response.expireAt}`]);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = error.errorMessage;
        }
      }
    });
  }

}
