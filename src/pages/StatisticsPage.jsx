import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { getTrainings } from '../services/api';

function StatisticsPage() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchTrainingsData();
    }, []);

    const fetchTrainingsData = async () => {
        try {
            const trainings = await getTrainings();

            const groupedData = trainings.reduce((result, training) => {
                const existingActivity = result.find(
                    (item) => item.activity === training.activity
                );

                if (existingActivity) {
                    existingActivity.duration += Number(training.duration);
                } else {
                    result.push({
                        activity: training.activity,
                        duration: Number(training.duration),
                    });
                }

                return result;
            }, []);

            setChartData(groupedData);
        } catch (error) {
            console.error('Error fetching statistics data:', error);
        }
    };

    return (
        <div>
            <h1>Statistics</h1>

            <div style={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="activity"
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                            height={80}
                        />
                        <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="duration" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default StatisticsPage;