import React, { useState, useEffect } from "react";
import { updateUser, fetchUserProfile } from "../../components/ApiServices";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const UserUpdateProfile = ({ id, departments, managers, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await fetchUserProfile(id);
        setUser(userProfile);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract only the work information fields from the user object
      const {
        joinDate,
        designation,
        jobTitle,
        employeeType,
        rosterType,
        department,
        manager,
        role,
      } = user;

      // Extract the personal information fields separately
      const personalInformation = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        username: user.username,
        marriageStatus: user.marriageStatus,
        country: user.country,
        permanentAddress: user.permanentAddress,
        contactNumber: user.contactNumber,
        emergencyContactNumber: user.emergencyContactNumber,
        dob: user.dob,
        status: user.status,
      };

      // Make the updateUser API call with both work and personal information
      const response = await updateUser(user.id, {
        ...personalInformation,
        joinDate,
        designation,
        jobTitle,
        employeeType,
        rosterType,
        department,
        manager,
        role,
      });

      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Profile updated:", response);
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl id="joinDate" mb={4} isRequired>
              <FormLabel>Date of Joining</FormLabel>
              <Input
                type="date"
                name="joinDate"
                value={user.joinDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="designation" mb={4} isRequired>
              <FormLabel>Designation</FormLabel>
              <Input
                type="text"
                name="designation"
                value={user.designation}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="jobTitle" mb={4} isRequired>
              <FormLabel>Job Title</FormLabel>
              <Input
                type="text"
                name="jobTitle"
                value={user.jobTitle}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="employeeType" mb={4} isRequired>
              <FormLabel>Employee Type</FormLabel>
              <Select
                name="employeeType"
                value={user.employeeType}
                onChange={handleInputChange}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Virtual">Virtual</option>
              </Select>
            </FormControl>
            <FormControl id="rosterType" mb={4} isRequired>
              <FormLabel>Roster Type</FormLabel>
              <Select
                name="rosterType"
                value={user.rosterType}
                onChange={handleInputChange}
              >
                <option value="WFH">WFH</option>
                <option value="WFO">WFO</option>
              </Select>
            </FormControl>
            <FormControl id="department" mb={4} isRequired>
              <FormLabel>Department</FormLabel>
              <Select
                name="department"
                value={user.department}
                onChange={handleInputChange}
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="manager" mb={4} isRequired>
              <FormLabel>Manager</FormLabel>
              <Select
                name="manager"
                value={user.manager}
                onChange={handleInputChange}
              >
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {`${manager.firstName} ${manager.lastName} [Id: ${manager.id}]`}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Update Profile
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserUpdateProfile;
