import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import { MdMailOutline, MdPowerSettingsNew } from 'react-icons/md';
import { FaLaptop } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();

  const handleMailClick = () => {
    // Open the mail client with the provided email address
    window.location.href = 'mailto:backendteam27@gmail.com';
  };

  const handleLogoutClick = () => {
    // Implement your logout logic here
    // For example: Call an API to perform logout, update state, etc.
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    history.push("/");

    console.log('Logged out successfully!');
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="gray.200" // Change the background color to teal
      color="black"
      padding="1rem"
    >
      {/* Mail Icon and Tooltip */}


      {/* Logo Icon and Text */}
      <Flex alignItems="center">
        <FaLaptop style={{ fontSize: '24px', marginRight: '8px', marginLeft: '18px' }} />

        {/* "LAMS" text */}
        <Text fontSize="2xl" fontWeight="bold">
          LAMS (Leave & Attendance Management System)
        </Text>
      </Flex>

      {/* Logout Icon and Tooltip */}
      <Link
        onClick={handleLogoutClick}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="full"
        backgroundColor="red.500"
        fontSize="xl"
        ml={4}
        title="Logout"
      >
        <MdPowerSettingsNew />
      </Link>
    </Flex>
  );
};

export default Header;
