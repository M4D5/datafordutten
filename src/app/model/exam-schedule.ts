export interface ExamSchedule {
    courseExceptions: Map<string, string[]>;
    schedulePlacementMappings: Map<string, string[]>;
    replacementExams: string[];
    examDates: string[];
}
