import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignUpForm } from '../../../../models/signUpForm.model';

@Component({
  selector: 'app-sign-up-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-form-component.html',
  styleUrl: './sign-up-form-component.css',
})
export class SignUpFormComponent {
  form = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  @Output() submitForm = new EventEmitter();

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form);
    }
  }
}
