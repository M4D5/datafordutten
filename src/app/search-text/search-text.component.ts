import {Component, Input} from '@angular/core';
import {DataTableComponent} from "../data-table/data-table.component";

@Component({
    selector: 'app-search-text',
    templateUrl: './search-text.component.html',
    styles: []
})
export class SearchTextComponent {
    @Input()
    dataTable: DataTableComponent;

    @Input()
    objectName: string = 'Entries';

    get shown(): number {
        return this.dataTable.tableData?.rowValues.length;
    }

    get matching(): number {
        return this.dataTable.tableData?.matchingRows;
    }

    get visible(): boolean {
        return !!this.dataTable.tableData;
    }
}
