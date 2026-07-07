import { monthlyTrendData, categoryExpenseData, categoryIncomeData } from '../data';
import { Download, Calendar, FileText } from 'lucide-react';
import React, { useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAnalytics } from '../hooks';
import {
    AnalyticsLoadingState,
    AnalyticsEmptyState,
    NoDataInRangeState,
    OverviewView,
    TrendsView,
    CategoriesView,
    ComparisonView,
} from '../components/analytics';
import {
    Input,
    Label,
    Button,
    Alert,
    AlertDescription,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '../components/ui';

interface AnalyticsProps {
    hasData?: boolean;
    isLoading?: boolean;
}

const Analytics: React.FC = ({ hasData = true, isLoading = false }: AnalyticsProps) => {
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    const {
        viewType,
        setViewType,
        timeRange,
        setTimeRange,
        reportType,
        setReportType,
        showDatePicker,
        setShowDatePicker,
        customDateRange,
        setCustomDateRange,
        isExporting,
        dateRangeError,
        validateDateRange,
        filteredData,
        totals,
        handleExportPDF,
        handleExportCSV,
    } = useAnalytics({ monthlyTrendData });

    if (isLoading) {
        return <AnalyticsLoadingState />;
    }

    if (!hasData) {
        return <AnalyticsEmptyState />;
    }

    const { monthlyData, dateRangeLabel, hasData: hasFilteredData } = filteredData;

    return (
        <>
            {/* Controls Section */}
            <div className="bg-white border-b p-3">
                <div className="container-fluid">
                    <div className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr_auto] gap-3 items-center pb-5">
                        {/* View Type Selector */}
                        <div className="w-full md:w-auto">
                            <Label className="block text-xs text-gray-500 mb-1">View</Label>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <Button
                                    size="sm"
                                    variant={viewType === 'overview' ? 'default' : 'outline'}
                                    onClick={() => setViewType('overview')}
                                    className="rounded-r-none"
                                >
                                    Overview
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewType === 'trends' ? 'default' : 'outline'}
                                    onClick={() => setViewType('trends')}
                                    className="rounded-none border-1-0"
                                >
                                    Trends
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewType === 'categories' ? 'default' : 'outline'}
                                    onClick={() => setViewType('categories')}
                                    className="rounded-none border-1-0"
                                >
                                    Categories
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewType === 'comparison' ? 'default' : 'outline'}
                                    onClick={() => setViewType('comparison')}
                                    className="rounded-none border-1-0"
                                >
                                    Comparison
                                </Button>
                            </div>
                        </div>
                        {/* Time Range Selector */}
                        <div className="w-full md:w-auto">
                            <Label className="block text-xs text-gray-500 mb-1">Time Range</Label>
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                                <Button
                                    size="sm"
                                    variant={timeRange === 'month' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('month')}
                                    className="rounded-r-none"
                                >
                                    Month
                                </Button>
                                <Button
                                    size="sm"
                                    variant={timeRange === 'quarter' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('quarter')}
                                    className="rounded-none border-1-0"
                                >
                                    Quarter
                                </Button>
                                <Button
                                    size="sm"
                                    variant={timeRange === 'year' ? 'default' : 'outline'}
                                    onClick={() => setTimeRange('year')}
                                    className="rounded-none border-1-0"
                                >
                                    Year
                                </Button>
                                <Button
                                    size="sm"
                                    variant={timeRange === 'custom' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setTimeRange('custom');
                                        setShowDatePicker(!showDatePicker);
                                    }}
                                    className="rounded-1-none border-1-0"
                                >
                                    <Calendar size={14} />
                                </Button>
                            </div>
                        </div>
                        {/* Custom Date Range */}
                        {showDatePicker && timeRange === 'custom' && (
                            <div className="w-full md:w-auto">
                                <Label className="block text-xs text-gray-500 mb-1">
                                    Custom Range
                                </Label>
                                <div className="flex gap-1 items-center flex-nowrap">
                                    <div className="flex items-stretch">
                                        <Input
                                            ref={startDateRef}
                                            type="date"
                                            className={`h-8 px-2 py-1 text-xs border rounded-1-md focus:outline-none 
                                                focus:ring-2 focus:ring-primary ${
                                                    dateRangeError
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                }`}
                                            style={{ width: '105px', borderRight: 'none' }}
                                            value={customDateRange.startDate}
                                            onChange={(e) => {
                                                const newStartDate = e.target.value;
                                                setCustomDateRange({
                                                    ...customDateRange,
                                                    startDate: newStartDate,
                                                });
                                                validateDateRange(
                                                    newStartDate,
                                                    customDateRange.endDate
                                                );
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            tabIndex={-1}
                                            className="inline-flex items-center justify-center px-2 border border-1-0 
                                                border-gray-300 rounded-r-md bg-white text-gray-500 
                                                hover:bg-gray-50 cursor-pointer"
                                            onClick={() => startDateRef.current?.showPicker()}
                                        >
                                            <Calendar size={14} />
                                        </Button>
                                    </div>
                                    <span className="text-gray-500 text-xs">to</span>
                                    <div className="flex items-stretch">
                                        <Input
                                            ref={endDateRef}
                                            type="date"
                                            className={`h-8 px-2 py-1 text-xs border rounded-1-md focus:outline-none 
                                                focus:ring-2 focus:ring-primary ${
                                                    dateRangeError
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                }
                                            `}
                                            style={{ width: '105px', borderRight: 'none' }}
                                            value={customDateRange.endDate}
                                            onChange={(e) => {
                                                const newEndDate = e.target.value;
                                                setCustomDateRange({
                                                    ...customDateRange,
                                                    endDate: newEndDate,
                                                });
                                                validateDateRange(
                                                    customDateRange.startDate,
                                                    newEndDate
                                                );
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            tabIndex={-1}
                                            className="inline-flex items-center justify-center px-2 border border-1-0
                                                border-gray-300 rounded-r-md bg-white text-gray-500
                                                hover:bg-gray-50 cursor-pointer"
                                            onClick={() => endDateRef.current?.showPicker()}
                                        >
                                            <Calendar size={14} />
                                        </Button>
                                    </div>
                                </div>
                                {dateRangeError && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{dateRangeError}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                        {/* Export Actions */}
                        <div className="w-full md:w-auto md:ml-auto">
                            <Label className="block text-xs text-gray-500 mb-1">&nbsp;</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isExporting}
                                    >
                                        {isExporting ? (
                                            <>
                                                <span
                                                    className="inline-block w-3 h-3 border-2 border-white
                                                        border-t-transparent rounded-full animate-spin mr-2"
                                                />
                                                Exporting...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={14} className="mr-2" />
                                                Export Report <span className="ml-1">▾</span>
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleExportPDF}>
                                        <FileText size={16} className="mr-2" />
                                        Export as PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleExportCSV(
                                                monthlyTrendData,
                                                categoryExpenseData,
                                                categoryIncomeData
                                            )
                                        }
                                    >
                                        <Download size={16} className="mr-2" />
                                        Export as CSV
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content Area */}
            <main className="flex-1 p-4">
                {!hasFilteredData && !dateRangeError ? (
                    <NoDataInRangeState dateRange={dateRangeLabel} />
                ) : (
                    <AnimatePresence mode="wait">
                        {viewType === 'overview' && (
                            <OverviewView key="overview" data={monthlyData} totals={totals} />
                        )}
                        {viewType === 'trends' && <TrendsView key="trends" data={monthlyData} />}
                        {viewType === 'categories' && <CategoriesView key="categories" />}
                        {viewType === 'comparison' && (
                            <ComparisonView
                                key="comparison"
                                reportType={reportType}
                                setReportType={setReportType}
                            />
                        )}
                    </AnimatePresence>
                )}
            </main>
        </>
    );
};

export default Analytics;
