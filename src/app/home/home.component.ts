import {Component} from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    faGithub = faGithub;
}
