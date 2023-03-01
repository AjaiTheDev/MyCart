import { Component } from '@angular/core';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  faShop = faShopify as IconProp;

  constructor(private tokenHelper: TokenHelper,
    private router: Router
  ) {
  }

  signOut() {
    let decision = confirm("Are you sure you want to logout ?");
    if (decision) {
      this.tokenHelper.removeToken();
      this.router.navigate(['/login']);
    }
    
  }
}
