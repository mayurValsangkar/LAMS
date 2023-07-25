import React, { useEffect, useState } from "react";
import {
  getPendingAttendanceRequests,
  confirmAttendance,
  rejectAttendance,
  fetchUserProfile,
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

const PendingAttendance = ({ currentUser }) => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchAttendanceRequests = async () => {
      try {
        const pendingAttendanceRequests = await getPendingAttendanceRequests();
        setAttendanceRequests(pendingAttendanceRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending attendance requests:", error);
      }
    };

    fetchAttendanceRequests();
  }, []);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = attendanceRequests.map(
        (attendanceRequest) => attendanceRequest.userId
      );
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
  }, [attendanceRequests]);

  const handleApprove = async (attendanceRequestId) => {
    try {
      setLoadingRequests((prevLoadingRequests) => [
        ...prevLoadingRequests,
        attendanceRequestId,
      ]);

      const response = await confirmAttendance(attendanceRequestId);
      toast({
        title: "Attendance Approved Successfully",
        description: "Attendance has been approved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setAttendanceRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== attendanceRequestId)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve attendance. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingRequests((prevLoadingRequests) =>
        prevLoadingRequests.filter((id) => id !== attendanceRequestId)
      );
    }
  };

  const handleReject = async (attendanceRequestId) => {
    try {
      setLoadingRequests((prevLoadingRequests) => [
        ...prevLoadingRequests,
        attendanceRequestId,
      ]);

      const response = await rejectAttendance(attendanceRequestId);
      toast({
        title: "Attendance Rejected Successfully",
        description: "Attendance has been rejected successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setAttendanceRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== attendanceRequestId)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject attendance. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingRequests((prevLoadingRequests) =>
        prevLoadingRequests.filter((id) => id !== attendanceRequestId)
      );
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Pending Attendance Requests</h1>
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
        attendanceRequests
          .filter((attendanceRequest) => {
            const userProfile = userProfiles[attendanceRequest.userId];
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
          .map((attendanceRequest) => {
            const userProfile = userProfiles[attendanceRequest.userId];
            const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
            const isLoading = loadingRequests.includes(attendanceRequest.id);

            return (
              <Box
                key={attendanceRequest.id}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
                mb={4}
              >
                <Flex align="center" mb={2}>
                  <Text fontSize="lg" fontWeight="bold">
                    User: {fullName}
                  </Text>
                  <Spacer />
                  <Box>
                    <IconButton
                      icon={<CheckIcon />}
                      colorScheme="green"
                      aria-label="Approve"
                      onClick={() => handleApprove(attendanceRequest.id)}
                      disabled={isLoading}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      colorScheme="red"
                      aria-label="Reject"
                      onClick={() => handleReject(attendanceRequest.id)}
                      ml={2}
                      disabled={isLoading}
                    />
                    {isLoading && <Spinner ml={2} />}
                  </Box>
                </Flex>
                <Text>Date: {attendanceRequest.date}</Text>
                <Text>Time: {attendanceRequest.time}</Text>
                <Text>Type: {attendanceRequest.type}</Text>
                <Text>Status: {attendanceRequest.status}</Text>
              </Box>
            );
          })
      )}
    </div>
  );
};

export default PendingAttendance;
