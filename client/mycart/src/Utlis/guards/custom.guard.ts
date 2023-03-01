import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Injectable({
  providedIn: 'root'
})
export class CustomGuard implements CanActivate {

  constructor(private tokenHelper: TokenHelper,
    private router: Router,
    private route: ActivatedRoute) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const hasToken = this.tokenHelper.hasToken();
    if (!hasToken) {
      this.router.navigate(['/signup']);
      return false;
    }

    const token = this.tokenHelper.getDecodedToken();
    var role = state.url.split('/')
    console.log(token.role.toLowerCase());

    if (role[1] != token.role.toLowerCase()) {
      this.router.navigate(['/login'])
      this.tokenHelper.removeToken();
      return false;
    }
    return true
  }
}
