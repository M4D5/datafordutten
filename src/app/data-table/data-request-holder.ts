import {Sort, SortDirection} from "../model/sort";
import {RequestFilter} from "./request-filter";
import {PageRequest} from "./page-request";
import {Utils} from "../utils/utils";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EventEmitter} from "@angular/core";
import {Observable} from "rxjs";

export class DataRequestHolder {
    private _onUpdate: EventEmitter<DataRequestHolder> = new EventEmitter<DataRequestHolder>();

    private _pageRequest: PageRequest = {pageSize: 10, page: 0};
    private _sortOptions: Sort = undefined;
    private _filter: RequestFilter = {globalSearchTerm: undefined};

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.recoverFilter();
        this.recoverPageOptions();
        this.recoverSortOptions();
    }

    // Getters
    get onUpdate(): Observable<DataRequestHolder> {
        return this._onUpdate.asObservable();
    }

    get page() {
        return this._pageRequest?.page;
    }

    get pageSize() {
        return this._pageRequest?.pageSize;
    }

    get filter() {
        return this._filter;
    }

    get sortOptions() {
        return Object.freeze(this._sortOptions);
    }

    get sortProperty() {
        return this._sortOptions?.property;
    }

    get sortDirection() {
        return this._sortOptions?.direction;
    }

    get globalSearchTerm() {
        return this._filter?.globalSearchTerm;
    }

    // Setters
    set sortOptions(val: Sort) {
        this._sortOptions = val;
        this._onUpdate.emit(this);
        this.persistSortOptions();
    }

    set page(val: number) {
        if (val < -1) {
            return;
        }

        this._pageRequest.page = val;
        this.emitUpdate();
        this.persistPageOptions();
    }

    set pageSize(val: number) {
        if (val == this._pageRequest.pageSize) return;

        this._pageRequest.pageSize = val;
        this.emitUpdate();
        this.persistPageOptions();
    }

    set globalSearchTerm(val: string) {
        this._filter.globalSearchTerm = val;
        this.emitUpdate();
        this.persistFilter();
    }

    private emitUpdate() {
        this._onUpdate.emit(this);
    }

    // Recovery and Persistence Methods

    private recoverFilter() {
        const globalSearchTerm: string = Utils.getQueryParameter(this.activatedRoute, 'globalSearchTerm');
        if (globalSearchTerm) this._filter = {globalSearchTerm: globalSearchTerm};
    }

    private persistFilter() {
        let params: Params;

        if (!this._filter) {
            params = {
                globalSearchTerm: undefined
            };
        } else {
            params = {
                globalSearchTerm: this._filter.globalSearchTerm
            };
        }
        Utils.updateQueryParameters(this.router, this.activatedRoute, params);
    }

    private recoverSortOptions() {
        const property: string = Utils.getQueryParameter(this.activatedRoute, 'property')
        const direction: SortDirection = <SortDirection>Utils.getQueryParameter(this.activatedRoute, 'direction')

        if (property && direction) this._sortOptions = {property: property, direction: direction};
    }

    private persistSortOptions() {
        let params: Params;

        if (!this._sortOptions) {
            params =  {
                property: undefined,
                direction: undefined
            };
        } else {
            params = {
                property: this._sortOptions.property,
                direction: this._sortOptions.direction
            };
        }

        Utils.updateQueryParameters(this.router, this.activatedRoute, params);
    }

    private recoverPageOptions() {
        const page: number = Utils.getQueryParameterAndParse(this.activatedRoute, 'page')
        const pageSize: number = Utils.getQueryParameterAndParse(this.activatedRoute, 'pageSize')

        if (page && pageSize) this._pageRequest = {page: page, pageSize: pageSize};
    }

    private persistPageOptions() {
        let params

        if (!this._pageRequest) {
            params = {
                page: undefined,
                pageSize: undefined
            };
        } else {
            params = {
                page: this._pageRequest.page,
                pageSize: this._pageRequest.pageSize
            };
        }

        Utils.updateQueryParameters(this.router, this.activatedRoute, params);
    }

    // Other Methods
    advancePage(by: number) {
        if (this._pageRequest.page + by < 0) {
            return;
        }

        this._pageRequest.page += by;
        this.emitUpdate();
    }
}
