import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CoursesComponent} from "./courses/courses.component";
import {GuideComponent} from "./guide/guide.component";
import {ExamsComponent} from "./exams/exams.component";


const routes: Routes = [
    {path: '', component: HomeComponent, data: {title: 'Data for Dutten - Home', animation: 'on'}},
    {path: 'guide', component: GuideComponent, data: {title: 'Data for Dutten - Guide', animation: 'on'}},
    {path: 'courses', component: CoursesComponent, data: {title: 'Data for Dutten - Courses', animation: 'on'}},
    {path: 'exams', component: ExamsComponent, data: {title: 'Data for Dutten - Exams', animation: 'on'}}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
