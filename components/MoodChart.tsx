'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface MoodData {
    created_at: string;
    mood_score: number;
}

interface MoodChartProps {
    data: MoodData[];
}

export default function MoodChart({ data }: MoodChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-64 flex items-center justify-center text-gray-400">
                No mood data available yet.
            </Card>
        );
    }

    // Process data for the chart
    const chartData = data
        .slice()
        .reverse() // API returns newest first, chart needs oldest first
        .map((mood) => ({
            date: new Date(mood.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
            }),
            score: mood.mood_score,
        }));

    return (
        <Card className="w-full h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Mood Trends</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 10]}
                            ticks={[0, 2, 4, 6, 8, 10]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
