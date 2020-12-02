import {Component, Input, OnInit} from '@angular/core';
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {Subject} from "rxjs";
import {debounceTime, map} from "rxjs/operators";
import {DataRequestHolder} from "../data-table/data-request-holder";

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styles: []
})
export class SearchBarComponent implements OnInit {
    faSearch = faSearch;

    @Input()
    dataRequestHolder: DataRequestHolder;

    searchTerm: string;
    subject: Subject<string> = new Subject<string>();

    constructor() {
    }

    ngOnInit(): void {
        this.searchTerm = this.dataRequestHolder.globalSearchTerm;

        this.dataRequestHolder.onUpdate.subscribe(r => this.searchTerm = r.globalSearchTerm);

        this.subject
            .pipe(debounceTime(300), map(r => r ? r : undefined))
            .subscribe(r => this.dataRequestHolder.globalSearchTerm = r);
    }

    search() {
        this.subject.next(this.searchTerm);
    }
}
