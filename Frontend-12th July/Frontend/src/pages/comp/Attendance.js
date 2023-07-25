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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { markAttendance } from "../../components/ApiServices";
import MultipleAttendance from "./MultipleAttendance";

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

const Attendance = () => {
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a state for submit button loading
  const toast = useToast();

  const handleMarkAttendance = async () => {
    if (!type) {
      toast({
        title: "Attendance Type is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true); // Set the loading state to true

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = `${now.getMonth() + 1}`.padStart(2, "0");
      const day = `${now.getDate()}`.padStart(2, "0");
      const hours = `${now.getHours()}`.padStart(2, "0");
      const minutes = `${now.getMinutes()}`.padStart(2, "0");
      const seconds = `${now.getSeconds()}`.padStart(2, "0");

      const currentTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      const attendance = {
        date,
        time: currentTime,
        type,
      };

      // Call the markAttendance API service method
      await markAttendance(attendance);

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

  return (
    <Tabs isFitted variant="enclosed" colorScheme="blue">
      <TabList>
        <Tab _selected={{ color: "white", bg: "blue.500" }}>
          Mark Single Attendance
        </Tab>
        <Tab _selected={{ color: "white", bg: "blue.500" }}>
          Mark Multiple Attendance
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box
            maxW="100%"
            w="100%"
            p={8}
            bg="white"
            boxShadow="md"
            rounded="md"
          >
            <Heading as="h1" size="xl" mb={4}>
              Mark Attendance
            </Heading>
            <VStack spacing={4} align="flex-start">
              <FormControl id="attendanceDate" isRequired>
                <FormLabel>Attendance Date</FormLabel>
                <Input
                  type="date"
                  value={date}
                  max={getCurrentDate()}
                  onChange={(e) => setDate(e.target.value)}
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
            </VStack>
          </Box>
        </TabPanel>
        <TabPanel>
          <MultipleAttendance /> {/* Render the MultipleAttendance component */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Attendance;
