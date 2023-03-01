import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private services: AccountService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private toaster: ToastrService
  ) { }

  model: LoginDto = {
    email: '',
    password: ''
  };

  ngOnInit() {
    this.tokenHelper.removeToken()
  }

  onSubmit() {
    this.services.login(this.model).subscribe({
      next: (response: any) => {
        this.tokenHelper.setToken(response.result);
        console.log(this.tokenHelper.getToken());
        let token = this.tokenHelper.getDecodedToken();
        if (token.role == 'Customer') {
          this.router.navigateByUrl('/customer/home');
        }
        else if (token.role == 'Admin') {
          this.router.navigateByUrl('/admin/home');
        }
      },
      error: (errors: any) => {
        this.toaster.error("Invalid Email/Password", "Login");
      }
    });
  }
}