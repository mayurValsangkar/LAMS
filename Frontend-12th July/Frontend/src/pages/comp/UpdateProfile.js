import React, { useState, useEffect } from "react";
import {
  updateUser,
  fetchProfile,
  fetchUserProfile,
  changePassword,
  getAllDepartments,
  getAllManagers,
} from "../../components/ApiServices";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await fetchProfile();
        const userProfile = await fetchUserProfile(profile.id);
        setUser(userProfile);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departmentData = await getAllDepartments();
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const managersData = await getAllManagers();
      setManagers(managersData);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setUser((prevUser) => ({
      ...prevUser,
      department: selectedValue,
    }));
  };

  const handleManagerChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedManager(selectedValue);
    setUser((prevUser) => ({
      ...prevUser,
      manager: selectedValue,
    }));
  };

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
      const response = await updateUser(user.id, user);
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Update Password Logic");
    setIsDialogOpen(true);
  };

  const handlePasswordUpdate = async () => {
    setIsDialogOpen(false);
    setLoading(true);

    try {
      await changePassword({
        email: user.email,
        currentPassword,
        newPassword,
      });
      toast({
        title: "Password Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isHR = user.role === "HR";

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Update Profile
      </Heading>
      <form onSubmit={handleSubmit}>
        {/* Render personal information fields */}
        <FormControl id="firstName" mb={4} isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="middleName" mb={4}>
          <FormLabel>Middle Name</FormLabel>
          <Input
            type="text"
            name="middleName"
            value={user.middleName}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="lastName" mb={4} isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="gender" mb={4} isRequired>
          <FormLabel>Gender</FormLabel>
          <Select
            name="gender"
            value={user.gender}
            onChange={handleInputChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>
        <FormControl id="email" mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="username" mb={4} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="marriageStatus" mb={4} isRequired>
          <FormLabel>Marriage Status</FormLabel>
          <Select
            name="marriageStatus"
            value={user.marriageStatus}
            onChange={handleInputChange}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </Select>
        </FormControl>
        <FormControl id="country" mb={4} isRequired>
          <FormLabel>Country</FormLabel>
          <Input
            type="text"
            name="country"
            value={user.country}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="permanentAddress" mb={4} isRequired>
          <FormLabel>Permanent Address</FormLabel>
          <Input
            type="text"
            name="permanentAddress"
            value={user.permanentAddress}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="contactNumber" mb={4} isRequired>
          <FormLabel>Contact Number</FormLabel>
          <Input
            type="number"
            name="contactNumber"
            value={user.contactNumber}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="emergencyContactNumber" mb={4} isRequired>
          <FormLabel>Emergency Contact Number</FormLabel>
          <Input
            type="number"
            name="emergencyContactNumber"
            value={user.emergencyContactNumber}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="dob" mb={4} isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            name="dob"
            value={user.dob}
            onChange={handleInputChange}
          />
        </FormControl>

        {/* Render work information fields only if user is HR */}
        {isHR && (
          <>
            <FormControl id="joinDate" mb={4} isRequired>
              <FormLabel>Date of Joining</FormLabel>
              <Input
                type="date"
                name="joinDate"
                value={user.joinDate}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="status" mb={4} isRequired>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={user.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
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
                placeholder="Select department"
                value={user.department}
                onChange={handleDepartmentChange}
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
                placeholder="Select Manager"
                value={user.manager}
                onChange={handleManagerChange}
              >
                {managers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName +
                      " " +
                      user.lastName +
                      " [Id: " +
                      user.id +
                      "]"}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="role" mb={4} isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={user.role}
                onChange={handleInputChange}
              >
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </Select>
            </FormControl>
          </>
        )}

        <Button
          type="submit"
          width="full"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Updating Profile"
          mb={4}
        >
          Update Profile
        </Button>
      </form>

      <Button
        type="button"
        colorScheme="teal"
        isLoading={loading}
        loadingText="Updating Password"
        width="full"
        mt={4}
        onClick={handlePasswordSubmit}
      >
        Update Password
      </Button>
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={undefined}
        onClose={handleDialogCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Password
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl id="currentPassword" mb={4} isRequired>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormControl>
              <FormControl id="newPassword" mb={4} isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={handlePasswordUpdate} mr={3}>
                Update
              </Button>
              <Button onClick={handleDialogCancel}>Cancel</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UpdateProfile;
