import { Component, inject } from '@angular/core';
import { SignUpFormComponent } from '../../components/sign-up-form-component/sign-up-form-component';
import { SignUpForm } from '../../../../models/signUpForm.model';
import { FormGroup } from '@angular/forms';
import { SignUpService } from '../../../../shared/services/api/sign-up-service';

@Component({
  selector: 'app-sign-up-main-page',
  imports: [SignUpFormComponent],
  templateUrl: './sign-up-main-page.html',
  styleUrl: './sign-up-main-page.css',
})
export class SignUpMainPage {
  private readonly signUpApiService = inject(SignUpService);

  onSubmit(form: FormGroup) {
    const signUpForm = new SignUpForm(
      form.controls['login'].value as string,
      form.controls['password'].value as string,
    );

    this.signUpApiService.postSignUpForm(signUpForm).subscribe();
  }
}
