import React, { useState } from 'react';
import { Box, Link, Text, Flex, Heading, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const Helpus = () => {
  const [issue, setIssue] = useState('');
  const userRole = sessionStorage.getItem('role');

  const handleSubmit = () => {
    window.location.href = `mailto:backendteam27@gmail.com?subject=Issue Submission&body=${issue}`;
  };

  return (
    <Box mt={8} p={6} borderWidth="1px" borderRadius="md" backgroundColor="gray.100">
      <Flex align="center" mb={4}>
        <AiOutlineQuestionCircle size={16} color="black" />
        <Heading as="h2" size="md" ml={2}>
          Help and Documentation
        </Heading>
      </Flex>
      {userRole && userRole.toLowerCase() === 'employee' && (
        <Flex align="center" mb={4}>
          <ExternalLinkIcon boxSize={4} mr={2} color="gray.600" />
          <Link
            href="https://drive.google.com/file/d/11J5-VY7GaVqvQGWkRXVSpe0JE-0uIpIi/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: 'underline' }}
          >
            Documentation on how to use the app for employees
          </Link>
        </Flex>
      )}
      {userRole && userRole.toLowerCase() === 'manager' && (
        <Flex align="center" mb={4}>
          <ExternalLinkIcon boxSize={4} mr={2} color="gray.600" />
          <Link
            href="https://drive.google.com/file/d/1adojR5h-asGnJ4PgSEsgRP4QMD0EvBdU/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: 'underline' }}
          >
            Documentation on how to use the app for managers
          </Link>
        </Flex>
      )}
      {userRole && userRole.toLowerCase() === 'hr' && (
        <Flex align="center" mb={4}>
          <ExternalLinkIcon boxSize={4} mr={2} color="gray.600" />
          <Link
            href="https://drive.google.com/file/d/1fi8vhq6B5rgun2aZv5GWc_aL9GAul1qA/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: 'underline' }}
          >
             Documentation on how to use the app for HR
          </Link>
        </Flex>
      )}
      <Heading as="h3" size="sm" mb={2}>
        Submit an Issue
      </Heading>
      <FormControl>
        <FormLabel htmlFor="issue">Issue Description</FormLabel>
        <Textarea id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Enter your issue" />
      </FormControl>
      <Button mt={4} colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
      {!userRole && (
        <Text color="gray.500" fontStyle="italic" textAlign="center" mt={4}>
          Log in to view documentation and submit issues.
        </Text>
      )}
    </Box>
  );
};

export default Helpus;
