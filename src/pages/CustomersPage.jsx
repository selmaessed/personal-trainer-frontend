import { useEffect, useState } from 'react';
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from '../services/api';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const [showForm, setShowForm] = useState(false);
    const [editingCustomerUrl, setEditingCustomerUrl] = useState(null);

    const emptyCustomer = {
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: '',
    };

    const [customerForm, setCustomerForm] = useState(emptyCustomer);

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setCustomerForm({
            ...customerForm,
            [name]: value,
        });
    };

    const handleAddCustomer = async (event) => {
        event.preventDefault();

        try {
            await addCustomer(customerForm);
            setCustomerForm(emptyCustomer);
            setShowForm(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleEditClick = (customer) => {
        setCustomerForm({
            firstname: customer.firstname,
            lastname: customer.lastname,
            streetaddress: customer.streetaddress,
            postcode: customer.postcode,
            city: customer.city,
            email: customer.email,
            phone: customer.phone,
        });

        setEditingCustomerUrl(customer._links.self.href);
        setShowForm(true);
    };

    const handleUpdateCustomer = async (event) => {
        event.preventDefault();

        try {
            await updateCustomer(editingCustomerUrl, customerForm);
            setCustomerForm(emptyCustomer);
            setEditingCustomerUrl(null);
            setShowForm(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCustomerUrl(null);
        setCustomerForm(emptyCustomer);
    };

    const handleDeleteCustomer = async (customerUrl) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this customer? All related trainings will also be deleted.'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteCustomer(customerUrl);
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
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

            <button
                onClick={() => {
                    if (showForm && !editingCustomerUrl) {
                        handleCancelForm();
                    } else {
                        setShowForm(true);
                        setEditingCustomerUrl(null);
                        setCustomerForm(emptyCustomer);
                    }
                }}
                style={primaryButtonStyle}
            >
                {showForm && !editingCustomerUrl ? 'Cancel' : 'Add customer'}
            </button>

            {showForm && (
                <form
                    onSubmit={editingCustomerUrl ? handleUpdateCustomer : handleAddCustomer}
                    style={formStyle}
                >
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First name"
                        value={customerForm.firstname}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last name"
                        value={customerForm.lastname}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="streetaddress"
                        placeholder="Street address"
                        value={customerForm.streetaddress}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="postcode"
                        placeholder="Postcode"
                        value={customerForm.postcode}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={customerForm.city}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={customerForm.email}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={customerForm.phone}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={saveButtonStyle}>
                            {editingCustomerUrl ? 'Update customer' : 'Save customer'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelForm}
                            style={cancelButtonStyle}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

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
                        <th style={thStyle}>Actions</th>
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
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditClick(customer)}
                                            style={editButtonStyle}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteCustomer(customer._links.self.href)}
                                            style={deleteButtonStyle}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={tdStyle} colSpan="8">
                                No customers found
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

const cancelButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#777',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
};

const editButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#f0ad4e',
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

export default CustomersPage;