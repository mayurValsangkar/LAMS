import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { addDepartment, getAllDepartments } from "../../components/ApiServices";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error retrieving departments:", error);
    }
  };

  const handleAddDepartment = async () => {
    if (newDepartment.trim() === "") {
      toast({
        title: "Error",
        description: "Department name cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addDepartment({ name: newDepartment });
      setNewDepartment("");
      fetchDepartments();
      toast({
        title: "Department Added",
        description: "The department has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={8} align="start">
      <Box width="full" p={8} bg="white" boxShadow="md" rounded="md">
        <Heading as="h1" size="xl" mb={4}>
          Department
        </Heading>

        <HStack spacing={4}>
          <Input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Department Name"
            size="md"
          />
          <Button colorScheme="blue" onClick={handleAddDepartment} px={8}>
            Add
          </Button>
        </HStack>
      </Box>

      <Box width="full">
        <Heading as="h2" size="lg" mb={4}>
          All Departments:
        </Heading>
        <SimpleGrid columns={3} spacing={4}>
          {departments.map((department) => (
            <Box
              key={department.id}
              p={4}
              bg="white"
              boxShadow="md"
              rounded="md"
            >
              <Text fontWeight="bold">ID: {department.id}</Text>
              <Text>Name: {department.name}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default Department;