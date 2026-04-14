const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

export async function getCustomers() {
    const response = await fetch(`${BASE_URL}/customers`);

    if (!response.ok) {
        throw new Error('Customers fetch failed');
    }

    const data = await response.json();
    return data._embedded.customers;
}

export async function getTrainings() {
    const response = await fetch(`${BASE_URL}/gettrainings`);

    if (!response.ok) {
        throw new Error('Trainings fetch failed');
    }

    const data = await response.json();
    return data;
}

export async function addCustomer(newCustomer) {
    const response = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
    });

    if (!response.ok) {
        throw new Error('Adding customer failed');
    }

    return await response.json();
}

export async function updateCustomer(customerUrl, updatedCustomer) {
    const response = await fetch(customerUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
    });

    if (!response.ok) {
        throw new Error('Updating customer failed');
    }
}

export async function deleteCustomer(customerUrl) {
    const response = await fetch(customerUrl, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Deleting customer failed');
    }
}

export async function addTraining(newTraining) {
    const response = await fetch(`${BASE_URL}/trainings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTraining),
    });

    if (!response.ok) {
        throw new Error('Adding training failed');
    }

    return await response.json();
}

export async function deleteTraining(trainingId) {
    const response = await fetch(`${BASE_URL}/trainings/${trainingId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Deleting training failed');
    }
}

