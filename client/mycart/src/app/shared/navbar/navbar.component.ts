import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  faShop = faShopify as IconProp;
  faCart = faCartShopping as IconProp;
  faCustomerProfile = faUser as IconProp;
  hasToken: boolean = false;

  constructor(private tokenHelper: TokenHelper) {
  }

  ngOnInit() {
    this.hasToken = this.tokenHelper.hasToken();
  }

}
