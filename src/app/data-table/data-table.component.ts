import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableData} from "./table-data";
import {TableDataProvider} from "./table-data-provider";
import {Sort, SortDirection} from "../model/sort";
import {ColumnDefinition, TableDefinition} from "./table-definition";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {delay} from "rxjs/operators";
import {Subscription} from "rxjs";
import {TableFilter} from "./table-filter";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../utils/utils";
import {TablePageRequest} from "./table-page-request";

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy {
    loading = false;

    noData = false;

    @Input()
    dataProvider: TableDataProvider;

    @Input()
    tableDefinition: TableDefinition<any>;

    tableData: TableData;
    sortOptions: Sort;

    filter: TableFilter;
    page: number = 0;

    pageSize: number = 10;
    dataUpdateSubscription: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {
        if (!this.dataProvider || !this.tableDefinition) {
            this.noData = true;
            return;
        }

        this.checkPropertyNames();

        this.filter = this.recoverFilter();
        this.sortOptions = this.recoverSortOptions();
        const pageOptions = this.recoverPageOptions();

        if (pageOptions) {
            this.page = pageOptions.page;
            this.pageSize = pageOptions.pageSize;
        }

        this.refresh();

        if (this.dataProvider.updatesEmitter) {
            this.dataUpdateSubscription = this.dataProvider.updatesEmitter()
                .subscribe(d => this.tableData = d);
        }
    }

    recoverFilter(): TableFilter {
        const filter: TableFilter = Utils.getQueryParameterAndParse(this.activatedRoute, 'filter');

        if (!filter) {
            return {globalSearchTerm: undefined};
        }

        return filter;
    }

    persistFilter() {
        Utils.updateQueryParameters(this.router, this.activatedRoute, {filter: JSON.stringify(this.filter)});
    }

    recoverSortOptions(): Sort {
        return Utils.getQueryParameterAndParse(this.activatedRoute, 'sortOptions');
    }

    persistSortOptions() {
        Utils.updateQueryParameters(this.router, this.activatedRoute, {sortOptions: JSON.stringify(this.sortOptions)});
    }

    recoverPageOptions(): TablePageRequest {
        return Utils.getQueryParameterAndParse(this.activatedRoute, 'pageOptions');
    }

    persistPageOptions() {
        Utils.updateQueryParameters(this.router, this.activatedRoute, {
            pageOptions: JSON.stringify({
                page: this.page,
                pageSize: this.pageSize
            })
        });
    }

    ngOnDestroy(): void {
        if (this.dataUpdateSubscription) {
            this.dataUpdateSubscription.unsubscribe();
        }
    }

    public updateGlobalSearchTerm(term: string) {
        this.filter.globalSearchTerm = term;
        this.persistFilter();
        this.refresh();
    }

    hasSortIcon(property: string) {
        return this.sortOptions && this.sortOptions.property === property;
    }

    getSortIcon(property: string) {
        if (!this.sortOptions || this.sortOptions.property !== property) {
            throw 'The column must be sorted on in order to get the sort icon';
        }

        if (this.sortOptions.direction === SortDirection.Ascending) {
            return faCaretUp;
        } else {
            return faCaretDown;
        }
    }

    checkPropertyNames() {
        for (let column of this.tableDefinition.columns) {
            this.getPropertyName(column);
        }
    }

    getPropertyName(column: ColumnDefinition<any>): string {
        if (!column.sortable) {
            return undefined;
        }

        if (column.propertyName) {
            return column.propertyName;
        }

        if (column.propertyNameFn) {
            const fnMatch = this.extractPropertyNameFromFn(column.propertyNameFn);

            if (!fnMatch) {
                throw 'Unable to extract property name from "propertyNameFn", please make sure the function is in arrow function format (obj => obj.propertyName) or specify the property name with the "propertyName" member';
            }

            return fnMatch[1];
        }

        const fnMatch = this.extractPropertyNameFromFn(column.valueAccessor);

        if (!fnMatch) {
            throw 'Unable to extract property name, please specify it with the "property" member in arrow function format (obj => obj.propertyName) or with the "propertyName" member';
        }

        return fnMatch[1];
    }

    extractPropertyNameFromFn(fn: Function) {
        const fnText = Function.prototype.toString.call(fn);
        return fnText.match(/=>.*?(\w+)$/);
    }

    advanceSort(property: string) {
        if (!property) {
            return;
        }

        if (this.sortOptions && this.sortOptions.property === property) {
            if (this.sortOptions.direction === SortDirection.Ascending) {
                this.sortOptions = {property: property, direction: SortDirection.Descending};
            } else if (this.sortOptions.direction === SortDirection.Descending) {
                this.sortOptions = undefined;
            }
        } else {
            this.sortOptions = {property: property, direction: SortDirection.Ascending};
        }

        this.persistSortOptions();
        this.page = 0;
        this.refresh();
    }

    advancePage(by: number) {
        if (this.page + by < 0 || this.page + by >= this.tableData.matchingPages) {
            return;
        }

        this.page += by;
        this.persistPageOptions();
        this.refresh();
    }

    goToPage(page: number) {
        if (page < 0 || page > this.tableData.matchingPages - 1 || this.page === page) {
            return;
        }

        this.page = page;
        this.persistPageOptions();
        this.refresh();
    }

    setPageSize(size: number) {
        this.pageSize = size;
        this.persistPageOptions();
        this.refresh();
    }

    refresh() {
        this.loading = true;
        this.noData = false;

        const dataObservable = this.dataProvider.getData(this.sortOptions, this.filter, {
            page: this.page,
            pageSize: this.pageSize
        });

        if (!dataObservable) {
            this.loading = false;
            this.noData = true;
            return;
        }

        dataObservable
            .pipe(delay(100))
            .subscribe(d => {
                this.loading = false;

                if (!d) {
                    this.noData = true;
                } else {
                    this.updateTableData(d);
                }
            });
    }

    updateTableData(tableData: TableData) {
        this.tableData = tableData;

        if (this.page > tableData.matchingPages - 1) {
            this.goToPage(tableData.matchingPages - 1);
            return;
        }

        if (this.page !== tableData.matchingPages - 1 && tableData.rowValues.length !== this.pageSize) {
            console.error(`Expected data to have the same size as the page size (${this.pageSize}), but had ${tableData.rowValues.length}`);
            this.noData = true;
            return;
        }
    }
}
