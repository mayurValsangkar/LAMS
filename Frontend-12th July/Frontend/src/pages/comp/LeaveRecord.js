import React, { useState, useEffect } from "react";
import {
  fetchProfile,
  getOneEmployeeLeaveRequests,
} from "../../components/ApiServices";
import {
  Box,
  Heading,
  useToast,
  Grid,
  GridItem,
  Flex,
  Text,
} from "@chakra-ui/react";

const LeaveRecord = () => {
  const [employee, setEmployee] = useState(null);
  const [leaveApplication, setLeaveApplication] = useState([]);

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

  useEffect(() => {
    const getLeaveRecord = async () => {
      try {
        const response = await getOneEmployeeLeaveRequests(employee?.id);
        console.log("Response:", response);
        const data = response;
        console.log("Data:", data);
        setLeaveApplication(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (employee?.id) {
      getLeaveRecord();
    }
  }, [employee]);

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h2" size="lg" mb={4}>
        My Leave Requests
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {leaveApplication && leaveApplication.length > 0 ? (
          leaveApplication.map((leave) => (
            <GridItem key={leave.id}>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                bg="white"
                height="100%"
              >
                <Flex direction="column">
                  <Text>Leave ID: {leave.id}</Text>
                  <Text>
                    Start Date: {new Date(leave.startDate).toLocaleDateString()}
                  </Text>
                  <Text>
                    End Date: {new Date(leave.endDate).toLocaleDateString()}
                  </Text>
                  <Text>Type: {leave.leaveType}</Text>
                  <Text>Status: {leave.status}</Text>
                  <Text>Specific Reason: {leave.specificReason}</Text>
                </Flex>
              </Box>
            </GridItem>
          ))
        ) : (
          <Text>No leave requests found.</Text>
        )}
      </Grid>
    </Box>
  );
};

export default LeaveRecord;
