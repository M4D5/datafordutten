import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {GuideComponent} from './guide/guide.component';
import {DataTableComponent} from './data-table/data-table.component';
import {TableCellHostComponent} from './data-table/table-cell-host.component';
import {DefaultCellTemplate} from "./data-table/cell-template";
import {CourseLinkCellTemplateComponent} from './course-link-cell-template.component';
import {ExamDatesCellTemplateComponent} from "./exams/exam-dates-cell-template.component";
import {SearchBarComponent} from './search-bar/search-bar.component';
import {SearchTextComponent} from './search-text/search-text.component';
import {ExamsComponent} from "./exams/exams.component";
import {CoursesComponent} from './courses/courses.component';
import {BackgroundColorCellTemplateComponent} from './courses/background-color-cell-template.component';
import { PaginationComponent } from './data-table/pagination/pagination.component';
import { LoadingOverlayComponent } from './data-table/loading-overlay/loading-overlay.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CourseCardComponent } from './course-card/course-card.component';
import { CourseCardListComponent } from './course-card-list/course-card-list.component';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuideComponent,
        ExamsComponent,
        DataTableComponent,
        DefaultCellTemplate,
        TableCellHostComponent,
        CourseLinkCellTemplateComponent,
        ExamDatesCellTemplateComponent,
        SearchBarComponent,
        SearchTextComponent,
        CoursesComponent,
        BackgroundColorCellTemplateComponent,
        PaginationComponent,
        LoadingOverlayComponent,
        CourseCardComponent,
        CourseCardListComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FontAwesomeModule,
        HttpClientModule,
        FormsModule,
        BsDropdownModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
