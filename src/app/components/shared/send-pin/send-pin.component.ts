import { Component, OnInit } from '@angular/core';
import { ForgetPasswordService } from '../../../services/forget-password.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-pin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './send-pin.component.html',
  styleUrl: './send-pin.component.css'
})
export class SendPinComponent implements OnInit {

    sendPinCodeForm: FormGroup = new FormGroup(
      {
        email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      },
    );

    errorMessage: string = '';
    isLoading :boolean = false;

    constructor(private _forgetpassService: ForgetPasswordService,
      private _Router : Router
    ) {}

    ngOnInit(): void {}

    get f() {
      return this.sendPinCodeForm.controls;
    }

    onSubmit() {
      if (this.sendPinCodeForm.invalid) {
        this.sendPinCodeForm.markAllAsTouched();
        return;
      }
      this.submitSendPinForm();
    }

    submitSendPinForm() {
      this.isLoading = true;
      const sendPinData = {
        email: this.sendPinCodeForm.value.email,
      };

      this._forgetpassService.SendPinCode(sendPinData).subscribe({
        next: (response) => {
          this.isLoading = false;
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
