import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

export default function Header() {
  return (
    <Box
      bg="brandwhite"
      boxShadow="md"
      color={'brandblack'}
      fontSize="sm"
      zIndex="1"
    >
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />

        {/* Spacer and Action Buttons */}
        <Flex ml="auto" gap={4} align="center">
          <Text
            as={NextLink}
            href="/login"
            color={'brandblack'}
            fontWeight={'semibold'}
          >
            Login
          </Text>

          {/* Small vertical line */}
          <Box height="4" borderLeft="1px" borderColor="brandgray" />

          <AnimatedSignUp />

          <Button bg={'brandyellow'}>Talk to us</Button>
        </Flex>
      </Flex>
    </Box>
  );
}