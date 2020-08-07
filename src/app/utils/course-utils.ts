import {compareCourses, Course} from "../model/course";
import {Sort, SortDirection} from "../model/sort";
import {TableFilter} from "../data-table/table-filter";
import {TablePageRequest} from "../data-table/table-page-request";

export class CourseUtils {
    static convertCoursesToList(courses: any): Course[] {
        const keys = Object.keys(courses);
        const list = [];

        for (let key of keys) {
            const obj = courses[key];
            obj.courseNumber = key;
            list.push(obj);
        }

        return list;
    }

    static getCourseLink(courseNumber: string) {
        return `https://kurser.dtu.dk/course/${courseNumber}`;
    }

    static matchesSearchTerm(searchTerm: string, course: Course): boolean {
        return course.courseNumber.startsWith(searchTerm) ||
            course.courseName && course.courseName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1;
    }

    static sortCourses(sort: Sort, data: Course[]) {
        if (!sort) {
            return data.sort((a, b) => compareCourses(a, b, SortDirection.Ascending, 'courseNumber'));
        } else {
            return data.sort((a, b) => compareCourses(a, b, sort.direction, sort.property));
        }
    }

    static prepareCourses(sort: Sort, filter: TableFilter, pageRequest: TablePageRequest, data: Course[]) {
        const filteredCourses = this.filterCourses(filter, data);
        const sortedCourses = CourseUtils.sortCourses(sort, filteredCourses);
        const pagedCourses = sortedCourses.slice(pageRequest.page * pageRequest.pageSize, (pageRequest.page + 1) * pageRequest.pageSize);

        return {
            totalRows: data.length,
            rowValues: pagedCourses,
            matchingRows: filteredCourses.length,
            matchingPages: Math.ceil(filteredCourses.length / pageRequest.pageSize)
        };
    }

    static filterCourses(filter: TableFilter, data: Course[]) {
        let filteredData = data;

        if (filter && filter.globalSearchTerm) {
            filteredData = data.filter(d => CourseUtils.matchesSearchTerm(filter.globalSearchTerm, d));
        }

        return filteredData;
    }
}
