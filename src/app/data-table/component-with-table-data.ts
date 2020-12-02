import {TableData} from "./table-data";

export interface ComponentWithTableData {
    getTableData(): TableData;
}
