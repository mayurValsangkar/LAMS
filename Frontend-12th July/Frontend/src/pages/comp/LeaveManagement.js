import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
} from "@chakra-ui/react";
import {
  getAllLeaveRequests,
  fetchUserProfile,
  fetchProfile,
} from "../../components/ApiServices";
import PendingLeave from "./PendingLeave";

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [groupedLeaveRequests, setGroupedLeaveRequests] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState({});

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchLeaveRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await fetchProfile();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const groupLeaveRequestsByUserId = async () => {
      const groupedRequests = {};
      for (const leaveRequest of leaveRequests) {
        if (!groupedRequests[leaveRequest.userId]) {
          groupedRequests[leaveRequest.userId] = [];
        }
        const userProfile = await fetchUserProfile(leaveRequest.userId);
        const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
        const leaveRequestWithFullName = { ...leaveRequest, fullName };
        groupedRequests[leaveRequest.userId].push(leaveRequestWithFullName);
      }
      setGroupedLeaveRequests(groupedRequests);
    };

    groupLeaveRequestsByUserId();
  }, [leaveRequests]);

  const fetchLeaveRequests = async () => {
    try {
      const data = await getAllLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLeaveRequests = Object.entries(groupedLeaveRequests).filter(
    ([userId, requests]) => {
      const userFullName = requests[0].fullName.toLowerCase();
      return userFullName.includes(searchTerm.toLowerCase());
    }
  );

  const renderLeaveRequests = () => {
    if (filteredLeaveRequests.length === 0) {
      return <Text fontSize="lg">No leave requests found.</Text>;
    }

    return filteredLeaveRequests.map(([userId, requests]) => (
      <Accordion key={userId} allowToggle>
        <AccordionItem border="1px" borderRadius="md" p="4" mb="4">
          <h2>
            <AccordionButton _expanded={{ bg: "teal.500", color: "white" }}>
              <Box flex="1" textAlign="left">
                Name: {requests[0].fullName}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {requests.map((leaveRequest) => (
              <Box
                key={leaveRequest.id}
                borderWidth="1px"
                borderRadius="md"
                p="4"
                mb="4"
              >
                <Text fontSize="lg" fontWeight="bold">
                  Leave Type: {leaveRequest.leaveType}
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Leave ID: {leaveRequest.id}
                </Text>
                <Text fontSize="lg">Start Date: {leaveRequest.startDate}</Text>
                <Text fontSize="lg">End Date: {leaveRequest.endDate}</Text>
                <Text fontSize="lg" fontWeight="bold">
                  Status: {leaveRequest.status}
                </Text>
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    ));
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Tabs
        isFitted
        variant="enclosed"
        colorScheme="blue"
        onChange={handleTabChange}
        index={activeTab}
      >
        <TabList>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>
            Leave Requests
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>
            Leave History
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p="4" bg="white" boxShadow="md" mb="4">
              <Text fontSize="xl">
                <PendingLeave currentUser={currentUser} />
              </Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p="4" bg="white" boxShadow="md" mb="4">
              <Input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                mb="4"
              />
              {renderLeaveRequests()}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LeaveManagement;
