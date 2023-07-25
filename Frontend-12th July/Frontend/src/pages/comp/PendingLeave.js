import React, { useEffect, useState } from "react";
import {
  getPendingLeaveRequests,
  fetchUserProfile,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../components/ApiServices";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Spacer,
  useToast,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const PendingLeave = ({ currentUser }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const pendingLeaveRequests = await getPendingLeaveRequests();
        setLeaveRequests(pendingLeaveRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = leaveRequests.map((leaveRequest) => leaveRequest.userId);
      const userProfilePromises = userIds.map((userId) =>
        fetchUserProfile(userId)
      );

      try {
        const profiles = await Promise.all(userProfilePromises);
        const userProfileData = profiles.reduce((data, profile) => {
          data[profile.id] = profile;
          return data;
        }, {});
        setUserProfiles(userProfileData);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();
  }, [leaveRequests]);

  const handleApprove = async (leaveRequestId) => {
    try {
      setLoadingRequests((prevLoadingRequests) => [
        ...prevLoadingRequests,
        leaveRequestId,
      ]);

      const response = await approveLeaveRequest(leaveRequestId);
      toast({
        title: "Leave Approved Successfully",
        description: "Leave application has been approved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setLeaveRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== leaveRequestId)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve leave application. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingRequests((prevLoadingRequests) =>
        prevLoadingRequests.filter((id) => id !== leaveRequestId)
      );
    }
  };

  const handleReject = async (leaveRequestId) => {
    try {
      setLoadingRequests((prevLoadingRequests) => [
        ...prevLoadingRequests,
        leaveRequestId,
      ]);

      const response = await rejectLeaveRequest(leaveRequestId);
      toast({
        title: "Leave Rejected Successfully",
        description: "Leave application has been rejected successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setLeaveRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== leaveRequestId)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject leave application. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingRequests((prevLoadingRequests) =>
        prevLoadingRequests.filter((id) => id !== leaveRequestId)
      );
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Pending Leave Requests</h1>
      <Input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        leaveRequests
          .filter((leaveRequest) => {
            const userProfile = userProfiles[leaveRequest.userId];
            const fullName = userProfile
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : "";
            return (
              userProfile &&
              userProfile.manager === currentUser.id &&
              (fullName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) || searchTerm === "")
            );
          })
          .map((leaveRequest) => {
            const userProfile = userProfiles[leaveRequest.userId];
            const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
            const isLoading = loadingRequests.includes(leaveRequest.id);

            return (
              <Box
                key={leaveRequest.id}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
                mb={4}
              >
                <Flex align="center" mb={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    Name: {fullName}
                  </Text>
                  <Spacer />
                  <Box>
                    <IconButton
                      icon={<CheckIcon />}
                      colorScheme="green"
                      aria-label="Approve"
                      onClick={() => handleApprove(leaveRequest.id)}
                      disabled={isLoading}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      colorScheme="red"
                      aria-label="Reject"
                      onClick={() => handleReject(leaveRequest.id)}
                      ml={2}
                      disabled={isLoading}
                    />
                    {isLoading && <Spinner ml={2} />}
                  </Box>
                </Flex>
                <Text>User ID: {leaveRequest.userId}</Text>
                <Text>Start Date: {leaveRequest.startDate}</Text>
                <Text>End Date: {leaveRequest.endDate}</Text>
                <Text>Reason: {leaveRequest.specificReason}</Text>
                <Text>Status: {leaveRequest.status}</Text>
                <Text>Leave Type: {leaveRequest.leaveType}</Text>
              </Box>
            );
          })
      )}
    </div>
  );
};

export default PendingLeave;
