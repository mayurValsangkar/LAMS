import React, { useState, useEffect } from "react";
import {
  fetchProfile,
  fetchUserProfile,
  getOneEmployeeAttendance,
} from "../../components/ApiServices";
import { Box, Heading, Grid, GridItem, Flex, Text } from "@chakra-ui/react";

const AttendanceRecord = () => {
  const [employee, setEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const data = await fetchProfile();
        setEmployee(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEmployeeProfile();
  }, []);

  const fetchUser = async (id) => {
    try {
      const data = await fetchUserProfile(id);
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const getAttendanceRecords = async () => {
      try {
        const response = await getOneEmployeeAttendance(employee?.id);
        console.log("Response:", response);
        const data = response;
        console.log("Data:", data);
        setAttendanceRecords(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (employee?.id) {
      getAttendanceRecords();
    }
  }, [employee]);

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h2" size="lg" mb={4}>
        My Attendance Records
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {attendanceRecords && attendanceRecords.length > 0 ? (
          attendanceRecords.map((attendance) => (
            <GridItem key={attendance.id}>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                bg="white"
                height="100%"
              >
                <Flex direction="column">
                  <Text>Attendance ID: {attendance.id}</Text>
                  <Text>
                    Date: {new Date(attendance.date).toLocaleDateString()}
                  </Text>
                  <Text>Time: {attendance.time}</Text>
                  <Text>Type: {attendance.type}</Text>
                  <Text>Status: {attendance.status}</Text>
                </Flex>
              </Box>
            </GridItem>
          ))
        ) : (
          <Text>No attendance records found.</Text>
        )}
      </Grid>
    </Box>
  );
};

export default AttendanceRecord;
