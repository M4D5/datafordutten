import {Sort} from "../model/sort";
import {TableData} from "./table-data";
import {Observable} from "rxjs";
import {EventEmitter} from "@angular/core";
import {TableFilter} from "./table-filter";
import {TablePageRequest} from "./table-page-request";

export interface TableDataProvider {
    updatesEmitter?(): EventEmitter<TableData>;

    getData(sort?: Sort, filter?: TableFilter, page?: TablePageRequest): Observable<TableData>;
}
