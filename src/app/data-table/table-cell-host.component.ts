import {ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef} from '@angular/core';
import {ColumnDefinition} from "./table-definition";
import {CellTemplate, DefaultCellTemplate} from "./cell-template";

@Directive({
    selector: '[tableCellHost]'
})
export class TableCellHostComponent implements OnInit {
    @Input()
    rowValue: any;

    @Input()
    col: ColumnDefinition<any>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
    }

    /**
     * When this element is applied to an ng-template element, it uses the template from the getTemplateRef function
     * from the component col.cellTemplateComponent to create an embedded view in the viewContainerRef. All this to
     * allow the caller to create a <td> tag directly under the <tr> tag.
     */
    ngOnInit(): void {
        let template;

        if (this.col.cellTemplateComponent) {
            template = this.col.cellTemplateComponent;
        } else {
            template = DefaultCellTemplate;
        }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(template);
        const componentRef = this.viewContainerRef.createComponent(componentFactory);
        componentRef.location.nativeElement.style = 'display: none';
        const instance = <CellTemplate<any>>componentRef.instance;

        instance.col = this.col;
        instance.value = this.rowValue;

        this.viewContainerRef.createEmbeddedView(instance.getTemplateRef());
    }
}
