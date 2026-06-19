export type ViewType = 'overview' | 'trends' | 'categories' | 'comparison';

export type TimeRange = 'month' | 'quarter' | 'year' | 'custom';

export type ReportType = 'monthly' | 'yearly';

export type SortOption = 'name' | 'balance' | 'type' | 'date';

export interface CustomDateRange {
    startDate: string;
    endDate: string;
}
