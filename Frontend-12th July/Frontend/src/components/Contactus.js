import React from "react";
import { Flex, Icon, Link, Text } from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

const Contactus = () => {
  const email = "backendteam27@gmail.com";

  return (
    <Flex align="center">
      <Flex align="center" mr={4}>
        <Link href={`mailto:${email}`} isExternal>
          <Icon
            as={EmailIcon}
            boxSize={5}
            color="blue.500"
            _hover={{ color: "blue.700" }}
          />
        </Link>
        <Text ml={2}>{email}</Text>
      </Flex>
    </Flex>
  );
};

export default Contactus;
