'use client';

import VehicleList from '@/components/shared/cars/VechileList/VechileList';
import useSWR from 'swr';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomGet, IRentals } from '@/fetchers/homeData';
import { FaComments } from 'react-icons/fa';
import React, { useState } from 'react';
import {
  Flex,
  Box,
  IconButton,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react';
import {CustomHeader as Header} from '@/components/shared/Header/CustomHeader/CustomHeader';
import {HeaderButton, LoginButton} from '@/components/shared/Header/Header';

export default function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data } = useSWR(swrKeys.registerUser, CustomGet<IRentals>); // Placeholder for rentals fetcher

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const headingSize = useBreakpointValue({
    base: '2xl', // Default heading size for laptop/tablet ????? IDK
    lg: '2xl', // Larger heading for desktop
  });

  const rentalswidth = useBreakpointValue({
    base: '100%', // Širina mape za mobilne uređaje i male ekrane
    lg: '80%', // Širina mape za srednje i velike ekrane
  });

  const rentalAllignment = useBreakpointValue({
    base: 'center',
    lg: 'space-between'
  })

  return (
    <Flex direction="column" grow={1} bg="brandlightgray" minH="100vh">
      {/* Header */}
      <Header>
        <Text fontSize="md" fontWeight="bold" color="brandblue">
          Balance: €31.42
        </Text>

        <Button
          bgColor={'brandblue'}
          color={'brandwhite'}
          size="sm"
          _hover={{ bg: 'brandyellow', color: 'brandblack',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          Add funds
        </Button>

        <HeaderButton> Edit profile </HeaderButton>

        <LoginButton log='out'/>
      </Header>
      {/* Main Content */}
      <Box position = "relative" width = "100vw">
        {/* Rentals */}
        <Flex
          mx="auto"
          justify={isChatOpen ? {rentalAllignment} : "center"}
          align="stretch"
          width={{ base: '80vw', lg: '100vw' }}
          p={gapSize}
          gap={gapSize}
          wrap={"nowrap"}
          direction={{ base: 'column', lg: 'row' }}
        >
          {/* Rentals Section */}
          <Flex
            direction="column"
            width={rentalswidth}
            bg="brandwhite"
            boxShadow="base"
            borderRadius="md"
            p={gapSize}
            gap={gapSize}
          >
            <Heading size={headingSize} color="brandblue" textAlign="center">
              Your Profile
            </Heading>
            <Divider />
            <VehicleList description="Ongoing rentals:" />
            <VehicleList description="Previously rented:" />
          </Flex>

          {/* Chats Section */}
          {isChatOpen ? (
            <Chat onClose={toggleChat} />
          ) : (
            <IconButton
              position="absolute"
              right={gapSize}
              top={gapSize}
              aria-label="Open chat"
              icon={<FaComments />}
              onClick={toggleChat}
              isRound
              size="lg"
              bg="brandblue"
              color="brandwhite"
              _hover={{ bg: 'brandyellow', color: 'brandblack' }}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

function Chat({ onClose }: { onClose: () => void }) {

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  return (
    <Flex
      direction="column"
      width="33%"
      bg="brandwhite"
      boxShadow="base"
      borderRadius="md"
      p={5}
      gap={gapSize}
    >
      <Heading size="md" color="brandblue">
        Chats
      </Heading>
      <Divider />
      <VStack align="stretch" spacing={3}>
        {['Admin', 'Company1', 'Company2', 'Company3'].map((chat, index) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            color="brandblue"
            justifyContent="flex-start"
            _hover={{ bg: 'brandlightgray' }}
          >
            {chat}
          </Button>
        ))}
      </VStack>
      <Button
        onClick={onClose}
        mt={3}
        size="sm"
        variant="solid"
        bg="brandblue"
        color="brandwhite"
        _hover={{ bg: 'brandyellow', color: 'brandblack' }}
      >
        Close
      </Button>
    </Flex>
  );
}