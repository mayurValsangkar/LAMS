import React, { useState, useEffect } from "react";
import { fetchProfile } from "../../components/ApiServices";
import { Box, Flex, Grid, Text, Heading, Skeleton } from "@chakra-ui/react";
import { MdPerson, MdWork, MdAccountCircle } from "react-icons/md";

const MyProfile = () => {
  const [employee, setEmployee] = useState(null);

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

  if (!employee) {
    return (
      <Flex
        maxW="90%"
        w="100%"
        p={8}
        bg="white"
        boxShadow="md"
        rounded="md"
        direction="column"
      >
        <Skeleton height="20px" mb={4} />
        <Skeleton height="20px" mb={4} />
        <Skeleton height="20px" mb={4} />
        <Skeleton height="20px" mb={4} />
      </Flex>
    );
  }

  const genderImage = employee.gender === "Male" ? "male.png" : "female.png";

  return (
    <Flex
      maxW="100%"
      w="100%"
      p={8}
      bg="white"
      boxShadow="md"
      rounded="md"
      direction="column"
    >
      <Box
        bg="gray.100"
        p={4}
        rounded="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <img
          src={`images/gender/${genderImage}`}
          alt={employee.firstName}
          width={42}
          height={42}
          style={{
            marginRight: "8px",
            borderRadius: "50%",
            border: "1px solid #ccc",
          }}
        />
        <Text ml={2} fontWeight="bold" fontSize="2xl">
          {employee.firstName}
        </Text>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={8}>
        <Box p={4} bg="gray.100" rounded="md">
          <Flex align="center" mb={4}>
            <MdPerson size={24} color="gray" />
            <Heading as="h2" size="lg" ml={2}>
              Personal Info.
            </Heading>
          </Flex>
          <Text>
            <Text fontWeight="bold" display="inline">
              ID:
            </Text>{" "}
            {employee.id}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Name:
            </Text>{" "}
            {`${employee.firstName} ${employee.lastName}`}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Gender:
            </Text>{" "}
            {employee.gender}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Email:
            </Text>{" "}
            {employee.email}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Username:
            </Text>{" "}
            {employee.username}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Marriage Status:
            </Text>{" "}
            {employee.marriageStatus}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Country:
            </Text>{" "}
            {employee.country}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Permanent Address:
            </Text>{" "}
            {employee.permanentAddress}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Contact Number:
            </Text>{" "}
            {employee.contactNumber}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Emergency Contact Number:
            </Text>{" "}
            {employee.emergencyContactNumber}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Date of Birth:
            </Text>{" "}
            {employee.dob}
          </Text>
        </Box>
        <Box p={4} bg="gray.100" rounded="md">
          <Flex align="center" mb={4}>
            <MdWork size={24} color="gray" />
            <Heading as="h2" size="lg" ml={2}>
              Work Information
            </Heading>
          </Flex>
          <Text>
            <Text fontWeight="bold" display="inline">
              Status:
            </Text>{" "}
            {employee.status}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Designation:
            </Text>{" "}
            {employee.designation}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Job Title:
            </Text>{" "}
            {employee.jobTitle}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Employee Type:
            </Text>{" "}
            {employee.employeeType}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Roster Type:
            </Text>{" "}
            {employee.rosterType}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Department:
            </Text>{" "}
            {employee.department}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Reporting Manager:
            </Text>{" "}
            {employee.manager}
          </Text>
          <Text mt={2}>
            <Text fontWeight="bold" display="inline">
              Role:
            </Text>{" "}
            {employee.role}
          </Text>
        </Box>
      </Grid>
    </Flex>
  );
};

export default MyProfile;
