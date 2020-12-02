import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TableDataProvider} from "../data-table/table-data-provider";
import {PageRequest} from "../data-table/page-request";
import {Utils} from "../utils/utils";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {delay} from "rxjs/operators";
import {TableData} from "../data-table/table-data";
import {DataRequestHolder} from "../data-table/data-request-holder";
import {ComponentWithTableData} from "../data-table/component-with-table-data";

@Component({
    selector: 'app-course-card-list',
    templateUrl: './course-card-list.component.html',
    styles: []
})
export class CourseCardListComponent implements OnInit, OnDestroy, ComponentWithTableData {
    loading = false;
    noData = false;

    dataUpdateSubscription: Subscription;

    tableData: TableData;

    @Input()
    dataProvider: TableDataProvider;

    @Input()
    dataRequestHolder: DataRequestHolder;

    constructor(private activatedRoute: ActivatedRoute) {
    }

    getTableData(): TableData {
        return this.tableData;
    }

    ngOnInit(): void {
        if (!this.dataProvider) {
            this.noData = true;
            return;
        }

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

    recoverPageOptions(): PageRequest {
        return Utils.getQueryParameterAndParse(this.activatedRoute, 'pageOptions');
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

    goToPage(page: number) {
        if (page < 0 || page > this.tableData.matchingPages - 1 || this.dataRequestHolder.page === page) {
            return;
        }

        this.refresh();
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
