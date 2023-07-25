import React, { useEffect, useState } from "react";
import { getCurrentUserRoster } from "../../components/ApiServices";
import { Box, Heading } from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Roster = () => {
  const [roster, setRoster] = useState([]);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    try {
      const Data = await getCurrentUserRoster();
      setRoster(Data);
    } catch (error) {
      console.error("Error retrieving roster:", error);
    }
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return {
        style: {
          backgroundColor: "#b3ffb3", // Light green for the current date
        },
      };
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      return {
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.4)", // Red shade for weekend days
        },
      };
    }

    return null;
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Roster
      </Heading>
      <Calendar
        localizer={localizer}
        events={roster.map((roster) => ({
          start: moment(roster.date).toDate(),
          end: moment(roster.date).toDate(),
          title: (
            <span
              style={{
                color: roster.type === "WFO" ? "white" : "black",
              }}
            >
              {roster.type}
            </span>
          ),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }} // Adjust the height
        dayPropGetter={dayPropGetter}
      />
    </Box>
  );
};

export default Roster;
