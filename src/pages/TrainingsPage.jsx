import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getTrainings } from '../services/api';

function TrainingsPage() {
    const [trainings, setTrainings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const data = await getTrainings();
            setTrainings(data);
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const getSortIndicator = (column) => {
        if (sortConfig.key !== column) return '';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const filteredTrainings = trainings
        .filter((training) => {
            const searchValue = searchTerm.trim().toLowerCase();

            const trainingText = `
        ${dayjs(training.date).format('DD.MM.YYYY HH:mm')}
        ${training.duration}
        ${training.activity}
        ${training.customer?.firstname || ''}
        ${training.customer?.lastname || ''}
      `.toLowerCase();

            return trainingText.includes(searchValue);
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;

            let aValue;
            let bValue;

            if (sortConfig.key === 'customer') {
                aValue = `${a.customer?.firstname || ''} ${a.customer?.lastname || ''}`;
                bValue = `${b.customer?.firstname || ''} ${b.customer?.lastname || ''}`;
            } else if (sortConfig.key === 'formattedDate') {
                aValue = new Date(a.date);
                bValue = new Date(b.date);
            } else {
                aValue = a[sortConfig.key] || '';
                bValue = b[sortConfig.key] || '';
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div>
            <h1>Trainings</h1>

            <input
                type="text"
                placeholder="Search trainings..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{
                    marginBottom: '20px',
                    padding: '10px',
                    width: '300px',
                    fontSize: '16px',
                }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={thStyle} onClick={() => handleSort('formattedDate')}>
                            Date{getSortIndicator('formattedDate')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('duration')}>
                            Duration{getSortIndicator('duration')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('activity')}>
                            Activity{getSortIndicator('activity')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('customer')}>
                            Customer{getSortIndicator('customer')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTrainings.length > 0 ? (
                        filteredTrainings.map((training) => (
                            <tr key={training.id}>
                                <td style={tdStyle}>
                                    {dayjs(training.date).format('DD.MM.YYYY HH:mm')}
                                </td>
                                <td style={tdStyle}>{training.duration} min</td>
                                <td style={tdStyle}>{training.activity}</td>
                                <td style={tdStyle}>
                                    {training.customer?.firstname} {training.customer?.lastname}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={tdStyle} colSpan="4">
                                No trainings found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
    cursor: 'pointer',
};

const tdStyle = {
    border: '1px solid #ccc',
    padding: '10px',
};

export default TrainingsPage;