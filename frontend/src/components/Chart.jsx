import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios"; // Import axios for API calls
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux"; // Assuming you are using Redux for authentication

// Set up moment.js localization for BigCalendar
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export const Chart = () => {
  const [events, setEvents] = useState([]); // State to hold events
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { user } = useSelector((state) => state.auth); // Assuming user data is in Redux state

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !user._id) {
        console.error("User ID is not available.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8800/api/task/agenda?userId=${user._id}`
        );

        if (response.status === 200) {
          // Transform backend data to match the calendar's event format
          const formattedEvents = response.data.tasks.map((task) => ({
            id: task._id,
            title: task.title,
            start: new Date(task.startAt),
            end: new Date(task.endAt),
            allDay: false, // Set true if the event is an all-day event
          }));
          setEvents(formattedEvents);
        } else {
          console.error("Failed to fetch events: Unexpected response");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Event selection handler
  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}`);
  };

  // Date selection handler
  const handleSelectSlot = (slotInfo) => {
    alert(`Selected slot from ${slotInfo.start.toLocaleString()} to ${slotInfo.end.toLocaleString()}`);
  };

  return (
    <div style={{ height: "70vh", padding: "20px", background: "#ffffff" }}>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable // Enable slot selection
          onSelectEvent={handleSelectEvent} // Triggered when an event is clicked
          onSelectSlot={handleSelectSlot} // Triggered when a time slot is clicked
          style={{
            height: "90%",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      )}
    </div>
  );
};
