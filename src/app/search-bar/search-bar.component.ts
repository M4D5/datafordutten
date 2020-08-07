import {Component, Input, OnInit} from '@angular/core';
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {DataTableComponent} from "../data-table/data-table.component";
import {ActivatedRoute} from "@angular/router";
import {TableFilter} from "../data-table/table-filter";

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styles: []
})
export class SearchBarComponent implements OnInit {
    faSearch = faSearch;

    @Input()
    dataTable: DataTableComponent;

    searchTerm: string;
    subject: Subject<string> = new Subject<string>();

    constructor(private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        const filterStr = this.activatedRoute.snapshot.queryParams.filter;

        if(filterStr) {
            const filter: TableFilter = JSON.parse(filterStr);
            this.searchTerm = filter.globalSearchTerm;
        }

        this.subject
            .pipe(debounceTime(300))
            .subscribe(r => {
                if (this.dataTable) {
                    this.dataTable.updateGlobalSearchTerm(r);
                }
            });
    }

    search() {
        this.subject.next(this.searchTerm);
    }
}
