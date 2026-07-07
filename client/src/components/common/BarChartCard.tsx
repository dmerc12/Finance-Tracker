import ChartWrapper from './ChartWrapper';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface BarSeriesConfig<T extends object> {
    dataKey: keyof T;
    name: string;
    color: string;
}

interface BarChartCardProps<T extends object> {
    title: string;
    description?: string;
    data: T[];
    xAxisKey: keyof T;
    series: BarSeriesConfig<T>[];
    height?: number;
    animationDelay?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    layout?: 'horizontal' | 'vertical';
}

export default function BarChartCard<T extends object>({
    title,
    description,
    data,
    xAxisKey,
    series,
    height = 350,
    animationDelay = 0,
    showGrid = true,
    showLegend = true,
    layout = 'horizontal',
}: BarChartCardProps<T>) {
    return (
        <ChartWrapper
            title={title}
            description={description}
            height={height}
            animationDelay={animationDelay}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout={layout}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    {layout === 'horizontal' ? (
                        <>
                            <XAxis dataKey={xAxisKey as string} />
                            <YAxis />
                        </>
                    ) : (
                        <>
                            <XAxis type="number" />
                            <YAxis dataKey={xAxisKey as string} type="category" width={120} />
                        </>
                    )}
                    <Tooltip />
                    {showLegend && <Legend />}
                    {series.map((s) => (
                        <Bar
                            key={s.dataKey as string}
                            dataKey={s.dataKey as string}
                            name={s.name}
                            fill={s.color}
                            radius={[8, 8, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
