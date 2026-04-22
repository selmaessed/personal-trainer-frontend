import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav
            style={{
                backgroundColor: '#1976d2',
                padding: '15px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <h2 style={{ color: 'white', margin: 0 }}>Personal Trainer App</h2>

            <div style={{ display: 'flex', gap: '15px' }}>
                <Link
                    to="/customers"
                    style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    Customers
                </Link>

                <Link
                    to="/trainings"
                    style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    Trainings
                </Link>

                <Link to="/calendar">Calendar</Link>
            </div>
        </nav>
    );
}

export default Navbar;