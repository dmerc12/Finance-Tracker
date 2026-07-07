import type UseAnalyticsReturn from './UseAnalyticsReturn';
import { useState, useMemo, useCallback } from 'react';
import type {
    MonthlyTrendData,
    CategoryData,
    ReportType,
    ViewType,
    TimeRange,
    CustomDateRange,
} from '../../types';

export interface UseAnalyticsOptions {
    monthlyTrendData: MonthlyTrendData[];
}

export default function useAnalytics({
    monthlyTrendData,
}: UseAnalyticsOptions): UseAnalyticsReturn {
    const [viewType, setViewType] = useState<ViewType>('overview');
    const [timeRange, setTimeRange] = useState<TimeRange>('month');
    const [reportType, setReportType] = useState<ReportType>('monthly');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [dateRangeError, setDateRangeError] = useState<string>('');
    const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
        startDate: '2025-07-01',
        endDate: '2026-02-23',
    });

    const validateDateRange = useCallback((start: string, end: string): boolean => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate) {
            setDateRangeError('Start date must be before end date');
            return false;
        }

        setDateRangeError('');
        return true;
    }, []);

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate: Date;
        let endDate = now;
        switch (timeRange) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter': {
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                break;
            }
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'custom':
                startDate = new Date(customDateRange.startDate);
                endDate = new Date(customDateRange.endDate);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        const monthMap: { [key: string]: Date } = {
            'Jul 2025': new Date(2025, 6, 1),
            'Aug 2025': new Date(2025, 7, 1),
            'Sep 2025': new Date(2025, 8, 1),
            'Oct 2025': new Date(2025, 9, 1),
            'Nov 2025': new Date(2025, 10, 1),
            'Dec 2025': new Date(2025, 11, 1),
            'Jan 2026': new Date(2026, 0, 1),
            'Feb 2026': new Date(2026, 1, 1),
        };
        const filteredMonthlyData = monthlyTrendData.filter((item) => {
            const itemDate = monthMap[item.month];
            return itemDate >= startDate && itemDate <= endDate;
        });
        return {
            monthlyData: filteredMonthlyData,
            dateRangeLabel:
                timeRange === 'custom'
                    ? `${customDateRange.startDate} to ${customDateRange.endDate}`
                    : timeRange.charAt(0).toUpperCase() + timeRange.slice(1),
            hasData: filteredMonthlyData.length > 0,
        };
    }, [timeRange, customDateRange, monthlyTrendData]);

    const totals = useMemo(() => {
        const totalIncome = filteredData.monthlyData.reduce((sum, item) => sum + item.income, 0);
        const totalExpenses = filteredData.monthlyData.reduce(
            (sum, item) => sum + item.expenses,
            0
        );
        const totalSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
        return {
            totalIncome,
            totalExpenses,
            totalSavings,
            savingsRate,
        };
    }, [filteredData.monthlyData]);

    const handleExportPDF = useCallback(() => {
        setIsExporting(true);
        setTimeout(() => {
            alert(
                'PDF report generated! (This is a demo - in production, this would download a PDF)'
            );
            setIsExporting(false);
        }, 1500);
    }, []);

    const handleExportCSV = useCallback(
        (
            monthlyData: MonthlyTrendData[],
            categoryExpenseData: CategoryData[],
            categoryIncomeData: CategoryData[]
        ) => {
            setIsExporting(true);
            setTimeout(() => {
                const csvContent =
                    '=== FINANCIAL ANALYTICS REPORT ===\n' +
                    `Date Range: ${customDateRange.startDate} to ${customDateRange.endDate}\n\n` +
                    '=== MONTHLY TRENDS ===\n' +
                    'Month,Income,Expenses,Savings\n' +
                    monthlyData
                        .map((d) => `${d.month},${d.income},${d.expenses},${d.savings}`)
                        .join('\n') +
                    '\n\n=== EXPENSE CATEGORIES ===\n' +
                    'Category,Amount\n' +
                    categoryExpenseData.map((d) => `${d.name},${d.value}`).join('\n') +
                    '\n\n=== INCOME SOURCES ===\n' +
                    'Source,Amount\n' +
                    categoryIncomeData.map((d) => `${d.name},${d.value}`).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                setIsExporting(false);
            }, 1000);
        },
        [customDateRange]
    );

    return {
        // View state
        viewType,
        setViewType,
        // Time range state
        timeRange,
        setTimeRange,
        // Report type state
        reportType,
        setReportType,
        // Date picker state
        showDatePicker,
        setShowDatePicker,
        // Custom date range
        customDateRange,
        setCustomDateRange,
        // Export state
        isExporting,
        setIsExporting,
        // Date validation
        dateRangeError,
        setDateRangeError,
        validateDateRange,
        // Filtered data
        filteredData,
        // Totals
        totals,
        // Export handlers
        handleExportPDF,
        handleExportCSV,
    };
}
