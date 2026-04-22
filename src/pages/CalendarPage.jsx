import { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getTrainings } from '../services/api';

const localizer = dayjsLocalizer(dayjs);

function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [currentView, setCurrentView] = useState('week');

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const data = await getTrainings();

            const formattedEvents = data.map((training) => {
                const start = new Date(training.date);
                const end = new Date(start.getTime() + training.duration * 60000);

                return {
                    title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
                    start,
                    end,
                };
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    return (
        <div>
            <h1>Calendar</h1>

            <div style={{ height: '80vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={currentView}
                    onView={(view) => setCurrentView(view)}
                    views={['month', 'week', 'day']}
                    defaultView="week"
                />
            </div>
        </div>
    );
}

export default CalendarPage;