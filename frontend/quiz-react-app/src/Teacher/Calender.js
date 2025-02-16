import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import axiosInstance from '../components/axiosInstance'

export default function Calendar() {
  const [examsDate, setExamsDate] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`calender/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        // Ensure the data is formatted correctly for FullCalendar
        const formattedEvents = response.data.map(event => ({
          title: event.title,
          start: new Date(event.start), // Ensure date format is correct
        }));

        setExamsDate(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  const handleDateClick = (arg) => {
    alert(`Selected Date: ${arg.dateStr}`)
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      weekends={true}
      events={examsDate}
      eventContent={renderEventContent}
    />
  )
}

function renderEventContent(eventInfo) {
  return (
    <div className='d-flex flex-column'>
      <i className='text-indigo-50'>{eventInfo.event.title}</i>
      <b className='text-muted'>{eventInfo.timeText}</b>
    </div>
  )
}
