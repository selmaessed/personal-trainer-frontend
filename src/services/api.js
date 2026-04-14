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