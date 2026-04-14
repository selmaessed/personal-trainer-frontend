import { useEffect, useState } from 'react';
import { getCustomers } from '../services/api';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    useEffect(() => {
        fetchCustomers();
    }, []);

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

    const filteredCustomers = customers
        .filter((customer) => {
            const searchValue = searchTerm.trim().toLowerCase();

            const customerText = `
        ${customer.firstname}
        ${customer.lastname}
        ${customer.streetaddress}
        ${customer.postcode}
        ${customer.city}
        ${customer.email}
        ${customer.phone}
      `.toLowerCase();

            return customerText.includes(searchValue);
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;

            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div>
            <h1>Customers</h1>

            <input
                type="text"
                placeholder="Search customers..."
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
                        <th style={thStyle} onClick={() => handleSort('firstname')}>
                            First name{getSortIndicator('firstname')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('lastname')}>
                            Last name{getSortIndicator('lastname')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('streetaddress')}>
                            Street address{getSortIndicator('streetaddress')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('postcode')}>
                            Postcode{getSortIndicator('postcode')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('city')}>
                            City{getSortIndicator('city')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('email')}>
                            Email{getSortIndicator('email')}
                        </th>
                        <th style={thStyle} onClick={() => handleSort('phone')}>
                            Phone{getSortIndicator('phone')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer, index) => (
                            <tr key={customer._links.self.href || index}>
                                <td style={tdStyle}>{customer.firstname}</td>
                                <td style={tdStyle}>{customer.lastname}</td>
                                <td style={tdStyle}>{customer.streetaddress}</td>
                                <td style={tdStyle}>{customer.postcode}</td>
                                <td style={tdStyle}>{customer.city}</td>
                                <td style={tdStyle}>{customer.email}</td>
                                <td style={tdStyle}>{customer.phone}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={tdStyle} colSpan="7">
                                No customers found
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

export default CustomersPage;