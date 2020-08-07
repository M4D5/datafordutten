import {Component, OnInit} from '@angular/core';
import {filter} from "rxjs/operators";
import {Title} from "@angular/platform-browser";
import {ActivationEnd, Router} from "@angular/router";
import {fadeAnimation} from "./animations";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
    state: any;

    constructor(private router: Router, private titleService: Title) {
    }

    ngOnInit() {
        this.router.events
            .pipe(
                filter((event) => event instanceof ActivationEnd)
            )
            .subscribe((event: ActivationEnd) => {
                    const title = event.snapshot.data.title;
                    this.titleService.setTitle(title);

                    if (this.state !== event.snapshot.pathFromRoot.toString()) {
                        this.state = event.snapshot.pathFromRoot.toString();
                    }
                }
            );
    }

    getRouterOutletState() {
        return this.state ? this.state : '';
    }
}
