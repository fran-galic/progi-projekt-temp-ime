'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FaCreditCard, FaWallet } from 'react-icons/fa';
import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomGet } from '@/fetchers/get';
import { CustomPost } from '@/fetchers/post';
import CustomCalendar from '@/components/features/DropDownMenus/CustomCalendar/CustomCalendar';
import { ExtraLocationInfo } from '@/typings/locations/locations';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  balance: number;
  locations: ExtraLocationInfo[];
  offer_id: string;
}

export interface Interval {
  dateTimeRented: string;
  dateTimeReturned: string;
}

export interface WorkingHour {
  /** 0 = Monday, 1 = Tuesday, …, 6 = Sunday */
  dayOfTheWeek: number;
  startTime: string;
  endTime: string;
}

export interface UnavailablePickupResponse {
  intervals: Interval[];
  workingHours: WorkingHour[];
}

export interface AvailableDropOffResponse {
  lastReturnDateTime: string | null;
  vehicle_id: number;
  workingHours: WorkingHour[];
}

// Reformat from "2025-01-24" to "24-01-2025"
function reverseDateFormat(isoDate: string) {
  // isoDate = "YYYY-MM-DD"
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`; // "DD-MM-YYYY"
}

const BookingForm: React.FC<BookingFormProps> = ({
  balance,
  locations,
  offer_id,
}) => {
  const toast = useToast();
  const router = useRouter();

  // State for pick-up
  const [pickupLocationId, setPickupLocationId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isPickupDateEnabled, setIsPickupDateEnabled] = useState(false);

  // State for drop-off
  const [dropoffLocationId, setDropoffLocationId] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [isDropOffDateTimeEnabled, setIsDropOffDateTimeEnabled] =
    useState(false);

  // For available vehicle ID (the backend sets it once we pick up the date/time)
  const [vehicle_id, setVehicle_id] = useState('');

  // -- SWR for pickup intervals
  const [pickUpDateTimeAvaiable, setPickUpDateTimeAvaiable] = useState<
    UnavailablePickupResponse | undefined
  >(undefined);

  const { trigger } = useSWRMutation<UnavailablePickupResponse>(
    swrKeys.unavailable_pick_up(offer_id, pickupLocationId),
    CustomGet,
    {
      onSuccess: (data) => {
        setPickUpDateTimeAvaiable(data);
        setIsPickupDateEnabled(true);
      },
      onError: (error) => {
        console.error('Error fetching pickup data:', error);
      },
    }
  );

  // -- SWR for dropoff intervals
  const [dropOffDateTimeAvaiable, setDropOffDateTimeAvaiable] = useState<
    AvailableDropOffResponse | undefined
  >(undefined);

  const { trigger: triggerDropOf } = useSWRMutation<AvailableDropOffResponse>(
    swrKeys.available_drop_off(
      offer_id,
      pickupLocationId,
      pickupDate,
      pickupTime,
      dropoffLocationId
    ),
    CustomGet,
    {
      onSuccess: (data) => {
        setDropOffDateTimeAvaiable(data);
        setIsDropOffDateTimeEnabled(true);
        setVehicle_id(data.vehicle_id.toString());
      },
      onError: (error) => {
        console.error('Error fetching drop-off data:', error);
      },
    }
  );

  // ** 2) Create the SWR mutation for rentOffer
  const { trigger: rentOfferTrigger } = useSWRMutation(
    swrKeys.rentOffer(offer_id),
    CustomPost,
    {
      onSuccess: (data: any) => {
        if (data?.detail) {
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('trans_id', data.trans_id);
              console.log('Transaction ID saved:', data.trans_id);
            } catch (error) {
              console.error('Error saving to localStorage:', error);
            }
          }
          if (data.detail.includes('stripe.com')) {
            window.location.href = data.detail;
          } else {
            toast({
              title: 'Transaction Successful! 🎉',
              description: 'Check your profile to view your reservations.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
        }
      },
      onError: (error: any) => {
        // If the backend returns "Insufficient funds." or some other 4xx
        if (error?.message?.includes('Insufficient funds')) {
          toast({
            title: 'Error',
            description: 'Insufficient funds. Please add more balance.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Something went wrong with the booking.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      },
    }
  );

  // Whenever pickupLocationId changes, fetch pickup intervals
  useEffect(() => {
    if (pickupLocationId) {
      trigger();
    }
  }, [pickupLocationId, trigger]);

  // Whenever dropoffLocationId changes, fetch dropoff intervals
  useEffect(() => {
    if (dropoffLocationId) {
      triggerDropOf();
    }
  }, [dropoffLocationId, triggerDropOf]);

  const handlePickupLocationChange = (locationId: string) => {
    setPickupLocationId(locationId);
    // Reset everything else
    setPickupDate('');
    setPickupTime('');
    setDropoffLocationId('');
    setDropoffDate('');
    setDropoffTime('');
    setIsDropOffDateTimeEnabled(false);
    setIsPickupDateEnabled(false);
  };

  const handleDropOffLocationChange = (locationId: string) => {
    setDropoffLocationId(locationId);
    setDropoffDate('');
    setDropoffTime('');
    setIsDropOffDateTimeEnabled(false);
  };

  const handlePickUpDateTimeSelect = (dateTime: Date | null) => {
    if (dateTime) {
      const formattedDate = dateTime.toISOString().split('T')[0];
      const hour = dateTime.getHours();
      setPickupDate(formattedDate);
      setPickupTime(hour.toString());
    } else {
      setPickupDate('');
      setPickupTime('');
      setDropoffLocationId('');
      setDropoffDate('');
      setDropoffTime('');
      setIsDropOffDateTimeEnabled(false);
    }
  };

  const handleDropoffDateTimeSelect = (dateTime: Date | null) => {
    if (dateTime) {
      const formattedDate = dateTime.toISOString().split('T')[0];
      const hour = dateTime.getHours();
      setDropoffDate(formattedDate);
      setDropoffTime(hour.toString());
    } else {
      setDropoffDate('');
      setDropoffTime('');
    }
  };

  const isDropoffLocationEnabled = pickupLocationId && pickupDate && pickupTime;
  const isTransactionEnabled =
    isDropoffLocationEnabled && dropoffLocationId && dropoffDate && dropoffTime;

  // ** 3) Actually call the rentOffer endpoint
  const handleRent = async (paymentMethod: string) => {
    try {
      const body = {
        paymentMethod: paymentMethod, // "wallet" or "stripe"
        dateFrom: reverseDateFormat(pickupDate), // "DD-MM-YYYY"
        dateTo: reverseDateFormat(dropoffDate), // "DD-MM-YYYY"
        pickLocId: Number(pickupLocationId),
        dropLocId: Number(dropoffLocationId),
        pickupTime: Number(pickupTime),
        dropoffTime: Number(dropoffTime),
      };
      console.log(body);
      // Fire the SWR POST mutation
      await rentOfferTrigger(body);
      // If successful, onSuccess handles the rest (redirect or toast).
    } catch (error) {
      console.error('Rent offer failed:', error);
    }
  };

  // -------------
  //  Modal logic
  // -------------
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Simple helper text for the modal
  const padHour = (hourString: string) => {
    const hour = parseInt(hourString, 10);
    return hour < 10 ? `0${hour}` : `${hour}`;
  };

  // Example reverseDateFormat for "YYYY-MM-DD" → "DD.MM.YYYY"
  function reverseDateFormatDot(isoDate: string) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
  }

  // Construct a more detailed modal description (with date & time)
  const pickupHourPadded = padHour(pickupTime);
  const dropoffHourPadded = padHour(dropoffTime);

  const modalDescription = `Rent this vehicle 
    from ${reverseDateFormatDot(pickupDate)} at ${pickupHourPadded}:00 
    to ${reverseDateFormatDot(dropoffDate)} at ${dropoffHourPadded}:00?`;

  const formWidth = useBreakpointValue({
    base: '100%',
    md: '80%',
    lg: '60%',
  });

  return (
    <Box
      width={formWidth}
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="brandwhite"
    >
      <Heading size="md" mb={6} color="brandblue" textAlign="center">
        Book this car
      </Heading>
      <Stack spacing={4}>
        {/* Pick-up location */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Pick-up location
          </Text>
          <Select
            placeholder="Select location"
            value={pickupLocationId}
            onChange={(e) => handlePickupLocationChange(e.target.value)}
            borderColor="brandblue"
            borderWidth="2px"
            borderRadius="md"
          >
            {locations.map((loc) => (
              <option key={loc.location_id} value={loc.location_id}>
                {`${loc.streetName} ${loc.streetNo}, ${loc.cityName}`}
              </option>
            ))}
          </Select>
        </Box>

        {/* Pick-up date/time */}
        <CustomCalendar
          pickupLabel="Pick-up date"
          pickupTimeLabel="Pick-up time"
          placeholderDate="dd.mm.gggg."
          placeholderTime="--:--"
          intervals={pickUpDateTimeAvaiable?.intervals}
          workingHours={pickUpDateTimeAvaiable?.workingHours}
          onDateTimeChange={handlePickUpDateTimeSelect}
          initialDateTime={null}
          minDate={new Date()}
          isDisabled={!isPickupDateEnabled}
          pickupLocationId={pickupLocationId}
        />

        {/* Drop-off location */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Drop-off location
          </Text>
          <Select
            placeholder="Select location"
            value={dropoffLocationId}
            onChange={(e) => handleDropOffLocationChange(e.target.value)}
            borderColor="brandblue"
            borderWidth="2px"
            borderRadius="md"
            isDisabled={!isDropoffLocationEnabled}
          >
            {locations.map((loc) => (
              <option key={loc.location_id} value={loc.location_id}>
                {`${loc.streetName} ${loc.streetNo}, ${loc.cityName}`}
              </option>
            ))}
          </Select>
        </Box>

        {/* Drop-off date/time */}
        <CustomCalendar
          pickupLabel="Drop-off date"
          pickupTimeLabel="Drop-off time"
          placeholderDate="dd.mm.gggg."
          placeholderTime="--:--"
          workingHours={dropOffDateTimeAvaiable?.workingHours}
          onDateTimeChange={handleDropoffDateTimeSelect}
          initialDateTime={null}
          minDate={
            new Date(
              new Date(pickupDate).setDate(new Date(pickupDate).getDate() + 1)
            )
          }
          maxDate={
            dropOffDateTimeAvaiable?.lastReturnDateTime
              ? new Date(
                  new Date(dropOffDateTimeAvaiable.lastReturnDateTime).setDate(
                    new Date(
                      dropOffDateTimeAvaiable.lastReturnDateTime
                    ).getDate() - 1
                  )
                )
              : undefined
          }
          isDisabled={!isDropOffDateTimeEnabled}
          pickupLocationId={pickupLocationId}
          dropoffLocationId={dropoffLocationId}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
        />
      </Stack>

      {/* Payment buttons */}
      <Flex
        justifyContent="center"
        alignItems="center"
        mt={6}
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        {/* PAY WITH WALLET - Open Modal instead of calling handleRent directly */}
        <Button
          rightIcon={<FaWallet />}
          bg="brandblue"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          size="lg"
          onClick={onOpen}
          isDisabled={!isTransactionEnabled}
          width={{ base: '100%', md: 'auto' }}
        >
          Pay with Wallet
        </Button>

        {/* PAY WITH CARD - same as before */}
        <Button
          rightIcon={<FaCreditCard />}
          bg="brandblue"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          size="lg"
          onClick={() => handleRent('stripe')}
          isDisabled={!isTransactionEnabled}
          width={{ base: '100%', md: 'auto' }}
        >
          Pay with Card
        </Button>
      </Flex>

      {/* Confirmation Modal for "Pay with Wallet" */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Wallet Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{modalDescription}</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} size="lg">
              No
            </Button>
            <Button
              bg="brandblue"
              color="white"
              _hover={{ bg: 'brandyellow', color: 'brandblack' }}
              size="lg"
              onClick={() => {
                handleRent('wallet');
                onClose();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookingForm;
