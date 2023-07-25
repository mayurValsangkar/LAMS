import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Input,
  useToast,
  SimpleGrid,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  addHoliday,
  addBulkHolidays,
  getAllHolidays,
  deleteHoliday,
} from "../../components/ApiServices";
import { DeleteIcon } from "@chakra-ui/icons";

const localizer = momentLocalizer(moment);

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [publicHoliday, setPublicHoliday] = useState({
    holidayDate: "",
    holidayDescription: "",
  });
  const [bulkHolidayFile, setBulkHolidayFile] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const toast = useToast();

  const userRole = sessionStorage.getItem("role");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const holidaysData = await getAllHolidays();
      setHolidays(holidaysData);
    } catch (error) {
      console.error("Error retrieving holidays:", error);
    }
  };

  const handleInputChange = (e) => {
    setPublicHoliday({
      ...publicHoliday,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setBulkHolidayFile(e.target.files[0]);
  };

  const handleAddHoliday = async () => {
    if (publicHoliday.holidayDate && publicHoliday.holidayDescription) {
      try {
        await addHoliday(publicHoliday);
        setPublicHoliday({
          holidayDate: "",
          holidayDescription: "",
        });
        fetchHolidays();
        toast({
          title: "Holiday Added",
          description: "The holiday has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error adding holiday:", error);
        toast({
          title: "Error",
          description: "Failed to add holiday. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter both date and description.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddBulkHolidays = async () => {
    try {
      await addBulkHolidays(bulkHolidayFile);
      setBulkHolidayFile(null);
      fetchHolidays();
      toast({
        title: "Bulk Holidays Added",
        description: "The bulk holidays have been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding bulk holidays:", error);
      toast({
        title: "Error",
        description: "Failed to add bulk holidays. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSeeCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleHideCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleDeleteHoliday = async (holidayId) => {
    try {
      await deleteHoliday(holidayId);
      fetchHolidays();
      toast({
        title: "Holiday Deleted",
        description: "The holiday has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast({
        title: "Error",
        description: "Failed to delete holiday. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return {
        style: {
          backgroundColor: "#66cc66", // Green for the current date
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
    <VStack spacing={8} align="stretch">
      <Box p={8} bg="white" boxShadow="md" rounded="md">
        <Heading as="h1" size="xl" mb={4}>
          Holiday Calendar
        </Heading>

        {userRole === "HR" && (
          <>
            <Input
              type="date"
              name="holidayDate"
              value={publicHoliday.holidayDate}
              onChange={handleInputChange}
              placeholder="Holiday Date"
              mb={4}
              isRequired
            />
            <Input
              type="text"
              name="holidayDescription"
              value={publicHoliday.holidayDescription}
              onChange={handleInputChange}
              placeholder="Holiday Description"
              mb={4}
              isRequired
            />
            <Button colorScheme="blue" onClick={handleAddHoliday} mb={4}>
              Add Holiday
            </Button>

            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              mb={4}
            />
            <Button colorScheme="blue" onClick={handleAddBulkHolidays} mb={4}>
              Add Bulk Holidays
            </Button>
          </>
        )}
      </Box>

      <Box width="full">
        <Heading as="h2" size="lg" mb={4}>
          All Holidays:
        </Heading>
        <SimpleGrid columns={3} spacing={4}>
          {holidays.map((holiday) => (
            <Box
              key={holiday.id}
              p={4}
              bg="white"
              boxShadow="md"
              rounded="md"
              position="relative"
            >
              <Text fontWeight="bold">ID: {holiday.id}</Text>
              <Text>Date: {holiday.holidayDate}</Text>
              <Text>Description: {holiday.holidayDescription}</Text>
              {userRole === "HR" && (
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="outline"
                  aria-label="Delete Holiday"
                  onClick={() => handleDeleteHoliday(holiday.id)}
                  position="absolute"
                  top={2}
                  right={2}
                />
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {isCalendarVisible ? (
        <>
          <Button onClick={handleHideCalendar} colorScheme="blue" mb={4}>
            Hide Calendar
          </Button>
          <Calendar
            localizer={localizer}
            events={holidays.map((holiday) => ({
              start: moment(holiday.holidayDate).toDate(),
              end: moment(holiday.holidayDate).toDate(),
              title: holiday.holidayDescription,
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }} // Adjust the height as per your design
            dayPropGetter={dayPropGetter} // Set the dayPropGetter here
          />
        </>
      ) : (
        <Button onClick={handleSeeCalendar} colorScheme="blue" mb={4}>
          See Calendar
        </Button>
      )}
    </VStack>
  );
};

export default Holiday;
