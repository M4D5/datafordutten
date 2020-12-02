import {TableData} from "./table-data";
import {Observable} from "rxjs";
import {EventEmitter} from "@angular/core";
import {DataRequestHolder} from "./data-request-holder";

export interface TableDataProvider {
    updatesEmitter?(): EventEmitter<TableData>;

    getData(requestHolder: DataRequestHolder): Observable<TableData>;
}
