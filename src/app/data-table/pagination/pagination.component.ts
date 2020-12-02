import {Component, Input} from '@angular/core';
import {faBackward, faCaretLeft, faCaretRight, faForward} from "@fortawesome/free-solid-svg-icons"
import {DataRequestHolder} from "../data-request-holder";
import {ComponentWithTableData} from "../component-with-table-data";

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
    requestHolder: DataRequestHolder;

    @Input()
    componentWithTableData: ComponentWithTableData;

    get paginationPages(): number[] {
        const width = 5;
        let startIndex = (this.requestHolder.page + 1) - Math.floor(width / 2);

        if (startIndex < 1) {
            startIndex = 1;
        }

        let endIndex = startIndex + width;

        if (!this.componentWithTableData) {
            endIndex = 1;
        } else if (endIndex >= this.componentWithTableData.getTableData()?.matchingPages + 1) {
            endIndex = this.componentWithTableData.getTableData()?.matchingPages + 1;
        }

        const result = [];

        for (let i = startIndex; i < endIndex; i++) {
            result.push(i);
        }

        return result;
    }

    get hasNext() {
        const tableData = this.componentWithTableData.getTableData();

        if(!tableData || tableData.matchingPages === 0) return false;

        return this.requestHolder.page !== tableData.matchingPages - 1
    }

    get hasPrev() {
        return this.requestHolder.page > 0;
    }
}
