import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Box,
  Heading,
  Text,
  Wrap,
  WrapItem,
  CloseButton,
} from "@chakra-ui/react";
import { markMultipleAttendance } from "../../components/ApiServices";

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}

const MultipleAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [type, setType] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a state for submit button loading
  const toast = useToast();

  const handleMarkAttendance = async () => {
    try {
      // Validate if there are attendance entries in the list
      if (attendanceList.length === 0) {
        toast({
          title: "No attendance entries",
          description: "Please select at least one date",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsSubmitting(true); // Set the loading state to true

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0");

      const currentTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

      // Prepare the attendance data for multiple dates
      const attendanceData = attendanceList.map((attendanceEntry) => ({
        date: attendanceEntry.date,
        time: currentTime,
        type: attendanceEntry.type,
      }));

      // Call the markMultipleAttendance API service method
      await markMultipleAttendance(attendanceData);

      toast({
        title: "Attendance Marked Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to mark attendance. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Set the loading state back to false
    }
  };

  const handleDateSelect = (e) => {
    const selectedDates = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];

    const newAttendanceList = selectedDates.map((selectedDate) => ({
      date: selectedDate,
      type,
    }));

    setAttendanceList((prevList) => [...prevList, ...newAttendanceList]);
    setDisabledDates((prevDates) => [...prevDates, ...selectedDates]);

    // Clear the selected dates in the input field
    e.target.value = "";
  };

  const handleClearAttendance = () => {
    setAttendanceList([]);
    setDisabledDates([]);
  };

  const handleClearEntry = (index) => {
    const updatedAttendanceList = [...attendanceList];
    updatedAttendanceList.splice(index, 1);
    setAttendanceList(updatedAttendanceList);
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Mark Attendance
      </Heading>
      <VStack spacing={4} align="flex-start">
        <FormControl id="attendanceDates" isRequired>
          <FormLabel>Attendance Dates</FormLabel>
          <Input
            type="date"
            multiple
            onChange={handleDateSelect}
            max={getCurrentDate()}
            defaultValue=""
            disabledDates={disabledDates}
          />
        </FormControl>
        <FormControl id="attendanceType" isRequired>
          <FormLabel>Attendance Type</FormLabel>
          <Select
            placeholder="Select attendance type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="WFH">WFH</option>
            <option value="WFO">WFO</option>
          </Select>
        </FormControl>
        <Button
          colorScheme="blue"
          width="full"
          onClick={handleMarkAttendance}
          isLoading={isSubmitting} // Add isLoading prop to display loading state
          loadingText="Marking Attendance"
        >
          Mark Attendance
        </Button>
        {attendanceList.length > 0 && (
          <Box mt={6}>
            <Text fontWeight="bold">Selected Dates:</Text>
            <Wrap mt={2}>
              {attendanceList.map((attendanceEntry, index) => (
                <WrapItem key={index}>
                  <CloseButton
                    size="sm"
                    onClick={() => handleClearEntry(index)}
                  />
                  <Text>{attendanceEntry.date}</Text>
                </WrapItem>
              ))}
            </Wrap>
            <Button
              colorScheme="red"
              variant="outline"
              mt={2}
              onClick={handleClearAttendance}
            >
              Clear All
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MultipleAttendance;
