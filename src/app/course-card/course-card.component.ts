import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Utils} from "../utils/utils";
import {ColorUtils} from "../utils/color-utils";
import {CourseUtils} from "../utils/course-utils";

@Component({
    selector: 'app-course-card',
    templateUrl: './course-card.component.html',
    styles: ['.flex-1 {flex: 1}']
})
export class CourseCardComponent {
    @Input()
    course: Course;

    formatPercent = val => Utils.formatPercent(val);

    getDefaultBackgroundColor = val => ColorUtils.colorRangeToString(
        val,
        ColorUtils.defaultColorRange,
        '#ddd');

    getAverageGradeBackgroundColor = val => ColorUtils.colorRangeToString(
        val,
        ColorUtils.averageGradeColorRange,
        '#ddd');

    getPercentPassedBackgroundColor = val => ColorUtils.colorRangeToString(
        val,
        ColorUtils.percentPassedColorRange,
        '#ddd');

    getCourseLink() {
        return CourseUtils.getCourseLink(this.course.courseNumber);
    }
}
