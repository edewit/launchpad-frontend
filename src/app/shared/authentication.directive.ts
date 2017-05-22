import {Directive, ElementRef, Input} from "@angular/core";
import {History} from "../wizard/history.component";
import {KeycloakService} from "./keycloak.service";
import {CiDirective} from "./ci.directive";

@Directive({
  selector: "[authentication]"
})
export class AuthenticationDirective {
  @Input("authentication") invert: boolean;

  constructor(private el: ElementRef, private history: History, private keycloak: KeycloakService) {
  }

  ngDoCheck() {
    let authentication = CiDirective.isCiChosen(this.history);
    let authenticated = this.keycloak.isAuthenticated();
    let render = authentication && !authenticated;
    if (this.invert) render = !render;
    this.el.nativeElement.style.display = render ? "none" : "block";
  }
}
