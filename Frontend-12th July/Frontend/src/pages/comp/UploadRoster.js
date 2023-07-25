import React, { useState, useEffect } from "react";
import {
  getHybridEmployees,
  generateCustomRosterForEmployees,
  updateRosterType,
} from "../../components/ApiServices";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Checkbox,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const UploadRoster = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [rosterType, setRosterType] = useState("WFO"); // Default value is "WFO"
  const toast = useToast();
  const localizer = momentLocalizer(moment);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employeesData = await getHybridEmployees();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error retrieving employees:", error);
    }
  };

  const handleEmployeeSelection = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleDateSelection = (slotInfo) => {
    const { start } = slotInfo;
    const selectedDate = moment(start).startOf("day").toDate();

    if (selectedDates.some((date) => moment(date).isSame(selectedDate, "day"))) {
      setSelectedDates(selectedDates.filter((date) => !moment(date).isSame(selectedDate, "day")));
    } else {
      setSelectedDates([...selectedDates, selectedDate]);
    }
  };

  const handleRosterUpload = async () => {
    try {
      if (selectedEmployees.length === 0) {
        toast({
          title: "Error Uploading Roster",
          description: "Please select at least one employee.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (selectedDates.length === 0) {
        toast({
          title: "Error Uploading Roster",
          description: "Please select at least one date.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await generateCustomRosterForEmployees(selectedEmployees, selectedDates, rosterType);
      toast({
        title: "Roster Uploaded",
        description: "The roster has been uploaded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error uploading roster:", error);
      toast({
        title: "Error Uploading Roster",
        description: "Failed to upload the roster. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRosterTypeChange = (event) => {
    setRosterType(event.target.value);
  };

  const dayPropGetter = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return {
        className: "weekend-day",
      };
    }
    const today = new Date();
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return {
        className: "current-day",
      };
    }
    return null;
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Upload Roster
      </Heading>
      <Table variant="simple">
        <Tbody>
          {employees.map((employee) => (
            <Tr key={employee.id}>
              <Td>{employee.id}</Td>
              <Td>{employee.firstName}</Td>
              <Td>{employee.lastName}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.gender}</Td>
              <Td>
                <Checkbox
                  isChecked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleEmployeeSelection(employee.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={4}>
        <Button onClick={() => setShowCalendar(!showCalendar)}>
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </Button>
      </Box>
      {showCalendar && (
        <Box mt={4}>
          <Calendar
            localizer={localizer}
            selectable
            events={selectedDates.map((date) => ({
              start: date,
              end: date,
              title: rosterType === "WFO" ? "Work From Office" : "Work From Home",
            }))}
            onSelectSlot={handleDateSelection}
            dayPropGetter={dayPropGetter}
            style={{ height: "500px" }}
          />
        </Box>
      )}
      <Box mt={4}>
        <Select value={rosterType} onChange={handleRosterTypeChange}>
          <option value="WFO">Work From Office</option>
          <option value="WFH">Work From Home</option>
        </Select>
      </Box>
      <Button colorScheme="blue" onClick={handleRosterUpload} mt={4}>
        Upload Roster
      </Button>
       <style jsx>{`
        /* Styles for weekend days */
        .weekend-day {
          background-color: #ff9999; /* Slightly darker red shade for weekend days */
        }

        /* Styles for the current date */
        .current-day {
          background-color: #66cc66; 
        }
      `}</style>
    </Box>
  );
};

export default UploadRoster;
