import {Component, Input} from '@angular/core';
import {DataTableComponent} from "../data-table.component";
import {faBackward, faCaretLeft, faCaretRight, faForward} from "@fortawesome/free-solid-svg-icons"

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styles: []
})
export class PaginationComponent {
    faCaretRight = faCaretRight;
    faCaretLeft = faCaretLeft;
    faForward = faForward;
    faBackward = faBackward;

    @Input()
    dataTable: DataTableComponent;

    get paginationPages(): number[] {
        const width = 5;
        let startIndex = (this.dataTable.page + 1) - Math.floor(width / 2);

        if (startIndex < 1) {
            startIndex = 1;
        }

        let endIndex = startIndex + width;

        if (!this.dataTable.tableData) {
            endIndex = 1;
        } else if (endIndex >= this.dataTable.tableData.matchingPages + 1) {
            endIndex = this.dataTable.tableData.matchingPages + 1;
        }

        const result = [];

        for (let i = startIndex; i < endIndex; i++) {
            result.push(i);
        }

        return result;
    }
}
