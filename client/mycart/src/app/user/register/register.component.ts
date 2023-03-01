import { Component, Input } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  displayPasswordError: Boolean = false;
  status: boolean = false;
  futureDate: boolean = false;

  model: customerCreateDto = {
    name: '',
    email: '',
    phone: '',
    dateOfBirth: new Date,
    password: '',
    cpassword: ''
  };

  constructor(
    private router: Router,
    private toaster: ToastrService,
    private service: AccountService,
    private tokenHelper: TokenHelper) {

  }

  ngOnInit() {
    this.tokenHelper.removeToken()
  }

  handleDob(dob: any) {
    let userDob = new Date(dob.value);

    // Substract Today's Date from User's Dob & output will be in milliseconds.
    const timeDiff = Math.abs(Date.now() - userDob.getTime());
    if (userDob.getTime() > Date.now()) {
      this.futureDate = true;
      this.status = false;
    } else {
      this.futureDate = false;

      // Converts from milliseconds to minutes.
      const timeDiffHour = timeDiff / 60000;

      // Converts from Minutes to Years.
      const ageInYears = timeDiffHour / 525600;

      if (ageInYears > 0 && ageInYears < 120) {
        if (ageInYears < 18) {
          this.status = true;
        } else {
          this.status = false;
        }
      }
    }
  }

  storePassword(password: NgModel) {
    this.model.password = password.value;
  }

  handlePassword(cpassword: NgModel) {
    let confirmPassword = cpassword.value;
    if (confirmPassword !== this.model.password) {
      this.displayPasswordError = true;
    } else {
      this.displayPasswordError = false;
    }
  }

  onSubmit() {
    this.service.create(this.model).subscribe({
      next: (response: any) => {
        if (response == null) {
          this.toaster.success("Registration Successful");
          this.router.navigate(['/login']);
        } else {
          this.toaster.error("Registrtaion Failed");
        }
      }
    })
  }
}
