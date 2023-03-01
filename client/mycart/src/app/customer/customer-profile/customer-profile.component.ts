import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})

export class CustomerProfileComponent implements OnInit {

  model = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  };

  constructor(private service: AccountService,
    private tokenHelper: TokenHelper,
    private router: Router) { }

  ngOnInit() {
    this.service.getProfile().subscribe({
      next: (response: any) => {
        var result = response.result;
        this.model.id = result.id;
        this.model.name = result.name;
        this.model.email = result.email;
        this.model.phone = result.phone;
        this.model.dateOfBirth = result.dateOfBirth;
      },
      error: (errors: any) => {
        console.log(errors);
      }
    });
  }

  signOut() {
    this.tokenHelper.removeToken();
    if (!this.tokenHelper.hasToken()) {
      let decision = confirm("Are you sure you want to logout");
      if (decision) {
        this.router.navigate(['login']);
      }
    }
  }
}
