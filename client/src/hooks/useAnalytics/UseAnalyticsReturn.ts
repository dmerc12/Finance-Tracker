import type { ReportType, ViewType, TimeRange } from './analytics-types';
import type { MonthlyTrendData, CategoryData } from '../../data';
import type CustomDateRange from './CustomDateRange';

export default interface UseAnalyticsReturn {
    // View state
    viewType: ViewType;
    setViewType: (type: ViewType) => void;
    // Time range state
    timeRange: TimeRange;
    setTimeRange: (range: TimeRange) => void;
    // Report type state
    reportType: ReportType;
    setReportType: (type: ReportType) => void;
    // Date picker state
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    // Custom date range
    customDateRange: CustomDateRange;
    setCustomDateRange: (range: CustomDateRange) => void;
    // Export state
    isExporting: boolean;
    setIsExporting: (exporting: boolean) => void;
    // Date validation
    dateRangeError: string;
    setDateRangeError: (error: string) => void;
    validateDateRange: (start: string, end: string) => boolean;
    // Filtered data
    filteredData: {
        monthlyData: MonthlyTrendData[];
        dateRangeLabel: string;
        hasData: boolean;
    };
    // Totals
    totals: {
        totalIncome: number;
        totalExpenses: number;
        totalSavings: number;
        savingsRate: number;
    };
    // Export handlers
    handleExportPDF: () => void;
    handleExportCSV: (
        monthlyData: MonthlyTrendData[],
        categoryExpenseData: CategoryData[],
        categoryIncomeData: CategoryData[]
    ) => void;
}
