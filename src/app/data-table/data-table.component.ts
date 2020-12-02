import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableData} from "./table-data";
import {TableDataProvider} from "./table-data-provider";
import {SortDirection} from "../model/sort";
import {ColumnDefinition, TableDefinition} from "./table-definition";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {delay} from "rxjs/operators";
import {Subscription} from "rxjs";
import {DataRequestHolder} from "./data-request-holder";
import {ComponentWithTableData} from "./component-with-table-data";

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, ComponentWithTableData {
    loading = false;

    noData = false;

    @Input()
    dataProvider: TableDataProvider;

    @Input()
    tableDefinition: TableDefinition<any>;

    tableData: TableData;

    @Input()
    dataRequestHolder: DataRequestHolder;

    dataUpdateSubscription: Subscription;

    getTableData(): TableData {
        return this.tableData;
    }

    ngOnInit(): void {
        if (!this.dataProvider || !this.tableDefinition) {
            this.noData = true;
            return;
        }

        this.checkPropertyNames();

        this.refresh();

        if (this.dataProvider.updatesEmitter) {
            this.dataUpdateSubscription = this.dataProvider.updatesEmitter()
                .subscribe(d => this.tableData = d);
        }

        this.dataRequestHolder.onUpdate.subscribe(_ => this.refresh());
    }

    ngOnDestroy(): void {
        if (this.dataUpdateSubscription) {
            this.dataUpdateSubscription.unsubscribe();
        }
    }

    hasSortIcon(property: string) {
        return this.dataRequestHolder.sortProperty === property;
    }

    getSortIcon(property: string) {
        if (this.dataRequestHolder.sortProperty !== property) {
            throw 'The column must be sorted on in order to get the sort icon';
        }

        if (this.dataRequestHolder.sortDirection === SortDirection.Ascending) {
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
            return null;
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

        if (this.dataRequestHolder.sortProperty === property) {
            if (this.dataRequestHolder.sortDirection === SortDirection.Ascending) {
                this.dataRequestHolder.sortOptions = {property: property, direction: SortDirection.Descending};
            } else if (this.dataRequestHolder.sortOptions.direction === SortDirection.Descending) {
                this.dataRequestHolder.sortOptions = undefined;
            }
        } else {
            this.dataRequestHolder.sortOptions = {property: property, direction: SortDirection.Ascending};
        }

        this.dataRequestHolder.page = 0;
        this.refresh();
    }

    advancePage(by: number) {
        this.dataRequestHolder.advancePage(by);
        this.refresh();
    }

    goToPage(page: number) {
        if (page > this.tableData.matchingPages - 1 || this.dataRequestHolder.page === page) {
            return;
        }

        this.dataRequestHolder.page = page;
        this.refresh();
    }

    setPageSize(size: number) {
        this.dataRequestHolder.pageSize = size;
        this.refresh();
    }

    refresh() {
        this.loading = true;
        this.noData = false;

        const dataObservable = this.dataProvider.getData(this.dataRequestHolder);

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

        if(this.dataRequestHolder.page === -1 && tableData.matchingPages > 0) {
            this.goToPage(0);
        } else if (this.dataRequestHolder.page !== 0) {
            if (this.dataRequestHolder.page > tableData.matchingPages - 1) {
                this.goToPage(tableData.matchingPages - 1);
                return;
            }

            if (this.dataRequestHolder.page !== tableData.matchingPages - 1 && tableData.rowValues.length !== this.dataRequestHolder.pageSize) {
                console.error(`Expected data to have the same size as the page size (${this.dataRequestHolder.pageSize}), but had ${tableData.rowValues.length}`);
                this.noData = true;
                return;
            }
        }
    }
}
