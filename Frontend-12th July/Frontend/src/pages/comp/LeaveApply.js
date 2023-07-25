import React, { useState, useEffect } from "react";
import {
  getCurrentUserLeaveBalance,
  fetchProfile,
  ApplyLeave,
} from "../../components/ApiServices";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Box,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeaveApply = () => {
  const [userId, setUserId] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [userGender, setUserGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const fetchUserId = async () => {
    try {
      const profile = await fetchProfile();
      setUserId(profile.id);
      setUserGender(profile.gender);
    } catch (error) {
      console.error("Error retrieving user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLeaveBalance(userId);
    }
  }, [userId]);

  const fetchLeaveBalance = async (userId) => {
    try {
      const balance = await getCurrentUserLeaveBalance(userId);
      setLeaveBalance(balance);
    } catch (error) {
      console.error("Error retrieving leave balance:", error);
    }
  };

  const handleSubmit = async () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all the required fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (leaveType === "Sick" && leaveBalance?.sickCount === 0) {
      toast({
        title: "Insufficient Leave Balance",
        description: "You have exhausted your sick leave balance.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (leaveType !== "Comp_off" && new Date(endDate) < new Date(startDate)) {
      toast({
        title: "Invalid Date Range",
        description: "End date should not be before start date.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const totalLeaveDays = calculateLeaveDuration(startDate, endDate);
    const availableLeaveDays = getAvailableLeaveDays(leaveType);

    if (leaveType !== "Comp_off" && totalLeaveDays > availableLeaveDays) {
      toast({
        title: "Insufficient Leave Balance",
        description:
          "You do not have enough leave balance for the selected duration.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leaveData = {
        leaveType,
        startDate,
        endDate,
        specificReason: reason,
      };

      const response = await ApplyLeave(leaveData);

      toast({
        title: "Leave Applied",
        description: "Your leave application has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave application. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeaveDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    return Math.round(Math.abs((end - start) / oneDay)) + 1; // Adding 1 to include both start and end dates
  };

  const getAvailableLeaveDays = (type) => {
    if (leaveBalance && type) {
      switch (type) {
        case "Sick":
          return leaveBalance.sickCount || 0;
        case "Casual":
          return leaveBalance.casualCount || 0;
        case "Personal":
          return leaveBalance.personalCount || 0;
        case "Maternity":
          return leaveBalance.maternityCount || 0;
        case "Paternity":
          return leaveBalance.paternityCount || 0;
        case "Marriage":
          return leaveBalance.marriageCount || 0;
        case "Comp_off":
          return leaveBalance.compOffCount || 0;
        default:
          return 0;
      }
    }
    return 0;
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday is 0, Saturday is 6
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && isWeekend(date) && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const filterEndDate = (date) => {
    return date >= startDate || !startDate;
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Leave Application
      </Heading>

      <SimpleGrid columns={3} spacing={4} mb={4}>
        <Box p={4} bg="white" boxShadow="md" rounded="md">
          <Text fontWeight="bold">Leave Balance</Text>
          <Text>Sick: {leaveBalance?.sickCount || 0}</Text>
        </Box>

        <Box p={4} bg="white" boxShadow="md" rounded="md">
          <Text fontWeight="bold">Leave Balance</Text>
          <Text>Casual: {leaveBalance?.casualCount || 0}</Text>
        </Box>

        <Box p={4} bg="white" boxShadow="md" rounded="md">
          <Text fontWeight="bold">Leave Balance</Text>
          <Text>Personal: {leaveBalance?.personalCount || 0}</Text>
        </Box>

        {!userGender || userGender !== "Male" ? (
          <Box p={4} bg="white" boxShadow="md" rounded="md">
            <Text fontWeight="bold">Leave Balance</Text>
            <Text>Maternity: {leaveBalance?.maternityCount || 0}</Text>
          </Box>
        ) : null}
        {!userGender || userGender !== "Female" ? (
          <Box p={4} bg="white" boxShadow="md" rounded="md">
            <Text fontWeight="bold">Leave Balance</Text>
            <Text>Paternity: {leaveBalance?.paternityCount || 0}</Text>
          </Box>
        ) : null}

        <Box p={4} bg="white" boxShadow="md" rounded="md">
          <Text fontWeight="bold">Leave Balance</Text>
          <Text>Marriage: {leaveBalance?.marriageCount || 0}</Text>
        </Box>
      </SimpleGrid>

      <FormControl id="leaveType" isRequired mb={4}>
        <FormLabel>Type of Leave</FormLabel>
        <Select
          placeholder="Select leave type"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          mb={4}
        >
          <option value="Sick">Sick Leave</option>
          <option value="Casual">Casual Leave</option>
          <option value="Personal">Personal Leave</option>
          {!userGender || userGender === "Male" ? null : (
            <option value="Maternity">Maternity Leave</option>
          )}
          {!userGender || userGender === "Female" ? null : (
            <option value="Paternity">Paternity Leave</option>
          )}
          <option value="Marriage">Marriage Leave</option>
          <option value="Comp_off">Comp_off</option>
        </Select>
      </FormControl>

      <FormControl id="startDate" isRequired mb={4}>
        <FormLabel>Start Date</FormLabel>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          filterDate={(date) => !isWeekend(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
        />
      </FormControl>

      <FormControl id="endDate" isRequired mb={4}>
        <FormLabel>End Date</FormLabel>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          filterDate={(date) => !isWeekend(date) && filterEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
        />
      </FormControl>
      <FormControl id="reason" isRequired mb={4}>
        <FormLabel>Reason</FormLabel>
        <Textarea
          placeholder="Enter reason for leave"
          value={reason}
          mb={4}
          onChange={(e) => setReason(e.target.value)}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="full"
        mb={4}
        onClick={handleSubmit}
        isLoading={isSubmitting}
        loadingText="Submitting"
      >
        Submit
      </Button>
    </Box>
  );
};

export default LeaveApply;
