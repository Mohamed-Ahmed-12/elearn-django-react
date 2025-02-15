import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

export default function Calender() {
    const handleDateClick = (arg) => {
        alert(arg.dateStr)
      }
    
    return (

            <FullCalendar
                plugins={[dayGridPlugin,interactionPlugin ]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                weekends={true}
                events={[
                    { title: 'event 1', date: '2025-02-01' },
                    { title: 'event 2', date: '2025-02-02' },
                    { title: 'event 3', date: '2025-02-03' },
                ]}
                eventContent={renderEventContent}
            />

    )
}

function renderEventContent(eventInfo) {
    return(
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }
