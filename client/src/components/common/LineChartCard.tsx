import ChartWrapper from './ChartWrapper';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface LineSeriesConfig<T extends Record<string, unknown>> {
    dataKey: keyof T;
    name: string;
    color: string;
    strokeWidth?: number;
}

interface LineChartCardProps<T extends Record<string, unknown>> {
    title: string;
    description?: string;
    data: T[];
    xAxisKey: keyof T;
    series: LineSeriesConfig<T>[];
    height?: number;
    animationDelay?: number;
    showGrid?: boolean;
    showLegend?: boolean;
}

export default function LineChartCard<T extends Record<string, unknown>>({
    title,
    description,
    data,
    xAxisKey,
    series,
    height = 350,
    animationDelay = 0,
    showGrid = true,
    showLegend = true,
}: LineChartCardProps<T>) {
    return (
        <ChartWrapper
            title={title}
            description={description}
            height={height}
            animationDelay={animationDelay}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    <XAxis dataKey={xAxisKey as string} />
                    <YAxis />
                    <Tooltip />
                    {showLegend && <Legend />}
                    {series.map((s) => (
                        <Line
                            key={s.dataKey as string}
                            type="monotone"
                            dataKey={s.dataKey as string}
                            name={s.name}
                            stroke={s.color}
                            strokeWidth={s.strokeWidth || 2}
                            dot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
