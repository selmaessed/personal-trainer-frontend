import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
    getTrainings,
    getCustomers,
    addTraining,
    deleteTraining,
} from '../services/api';

function TrainingsPage() {
    const [trainings, setTrainings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [showForm, setShowForm] = useState(false);

    const emptyTraining = {
        date: '',
        activity: '',
        duration: '',
        customer: '',
    };

    const [trainingForm, setTrainingForm] = useState(emptyTraining);

    useEffect(() => {
        fetchTrainings();
        fetchCustomers();
    }, []);

    const fetchTrainings = async () => {
        try {
            const data = await getTrainings();
            setTrainings(data);
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setTrainingForm({
            ...trainingForm,
            [name]: value,
        });
    };

    const handleAddTraining = async (event) => {
        event.preventDefault();

        try {
            const trainingToSave = {
                date: new Date(trainingForm.date).toISOString(),
                activity: trainingForm.activity,
                duration: trainingForm.duration,
                customer: trainingForm.customer,
            };

            await addTraining(trainingToSave);

            setTrainingForm(emptyTraining);
            setShowForm(false);
            fetchTrainings();
        } catch (error) {
            console.error('Error adding training:', error);
        }
    };

    const handleDeleteTraining = async (trainingId) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this training?'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteTraining(trainingId);
            fetchTrainings();
        } catch (error) {
            console.error('Error deleting training:', error);
        }
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

            <button
                onClick={() => {
                    setShowForm(!showForm);
                    if (showForm) {
                        setTrainingForm(emptyTraining);
                    }
                }}
                style={primaryButtonStyle}
            >
                {showForm ? 'Cancel' : 'Add training'}
            </button>

            {showForm && (
                <form onSubmit={handleAddTraining} style={formStyle}>
                    <input
                        type="datetime-local"
                        name="date"
                        value={trainingForm.date}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="activity"
                        placeholder="Activity"
                        value={trainingForm.activity}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="number"
                        name="duration"
                        placeholder="Duration in minutes"
                        value={trainingForm.duration}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <select
                        name="customer"
                        value={trainingForm.customer}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    >
                        <option value="">Select customer</option>
                        {customers.map((customer, index) => (
                            <option
                                key={customer._links.self.href || index}
                                value={customer._links.self.href}
                            >
                                {customer.firstname} {customer.lastname}
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={saveButtonStyle}>
                        Save training
                    </button>
                </form>
            )}

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
                        <th style={thStyle}>Actions</th>
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
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDeleteTraining(training.id)}
                                        style={deleteButtonStyle}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={tdStyle} colSpan="5">
                                No trainings found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
    maxWidth: '800px',
};

const inputStyle = {
    padding: '10px',
    fontSize: '14px',
};

const primaryButtonStyle = {
    marginBottom: '20px',
    padding: '10px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
};

const saveButtonStyle = {
    padding: '10px 16px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
};

const deleteButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
};

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