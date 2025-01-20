'use client';

import VehicleOfferCard from '@/components/shared/cars/VehicleOfferCard/VehicleOfferCard';
import Footer from '@/components/shared/Footer/Footer';
import AuthUserHeader from '@/components/shared/Header/AuthUserHeader/AuthUserHeader';
import Header from '@/components/shared/Header/Header';
import CustomMap from '@/components/shared/Map/CustomMap/CustomMap';
import BookingForm from '@/components/shared/offer/BookingForm/BookingForm';
import BookingLoginPrompt from '@/components/shared/offer/BookingLoginPrompt/BookingLoginPrompt';
import {
  ReviewList,
  ReviewListProps,
} from '@/components/shared/review/ReviewList/ReviewList';
import { useUserContext } from '@/context/UserContext/UserContext';
import { dealershipLocations } from '@/mockData/mockLocations';
import { mockReviews } from '@/mockData/mockReviews';
import { use } from 'react';
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { CustomGet, IOffer } from '@/fetchers/homeData'; // Your fetcher function
import {
  FaCcMastercard,
  FaCcStripe,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';
import { swrKeys } from '@/fetchers/swrKeys';
import { LocationsResponse } from '@/typings/locations/locations';

const FooterLinks = {
  quickLinks: [
    { label: 'Home', href: '/home' },
    { label: 'About Us', href: '/TalkToUs' },
    { label: 'FAQ', href: '/home#faq-section' },
    { label: 'Contact Us', href: '/TalkToUs' },
  ],
  contactInfo: {
    phone: '+385 95 517 1890',
    email: 'support@easyrent.com',
    address: 'Unska ul. 3, 10000, Zagreb',
  },
  socialLinks: [
    { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
    { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
    { label: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  ],
  paymentIcons: [FaCcVisa, FaCcMastercard, FaCcStripe],
};

export default function OfferPage({
  params,
}: {
  params: Promise<{ offer_id: string }>;
}) {
  const { offer_id } = use(params); // Unwrap the params promise

  const { user } = useUserContext();

  const { data: offer, error } = useSWR<IOffer>(
    offer_id ? swrKeys.offer(offer_id) : null, // Fetch only if `offer_id` exists
    CustomGet
  );

  const { data: offerLocations = { locations: [] } } =
    useSWR<LocationsResponse>(
      offer_id ? swrKeys.offerLocations(offer_id) : null,
      CustomGet
    );

  const { data: reviewsData, error: reviewsError } = useSWR<ReviewListProps>(
    offer_id ? swrKeys.reviews(offer_id) : null,
    CustomGet
  );

  const containerWidth = useBreakpointValue({
    base: '90%',
    sm: '85%',
    md: '80%',
    lg: '80%',
    xl: '80%',
  });

  if (!offer && !error) {
    return (
      <Flex
        height="100vh"
        width="100%"
        align="center"
        justify="center"
        direction="column"
        gap={6}
        bg="gray.50"
      >
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          color="brandblue"
          textAlign="center"
        >
          We are getting your offer...
        </Text>
        <Spinner size="xl" color="brandblue" thickness="4px" speed="0.8s" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        height="100vh"
        width="100%"
        align="center"
        justify="center"
        direction="column"
        gap={6}
        bg="brandwhite"
        p={6}
      >
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          color="brandblue"
          textAlign="center"
        >
          Failed to load the offer
        </Text>
        <Text
          fontSize="lg"
          color="brandblack"
          textAlign="center"
          maxWidth="80%"
        >
          Please check your internet connection or try again later.
        </Text>
        <Box>
          <Flex justifyContent="center" mt={4}>
            <a href="/home">
              <Box
                as="button"
                bg="brandblue"
                color="brandwhite"
                px={6}
                py={3}
                borderRadius="md"
                fontWeight="bold"
                _hover={{
                  bg: 'brandyellow',
                  transition: 'background-color 0.3s ease',
                  color: 'brandblack',
                }}
                _active={{
                  bg: 'blue.700',
                }}
              >
                Go to Home Page
              </Box>
            </a>
          </Flex>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      grow={1}
      align={'center'}
      width={'100%'}
      gap={5}
      justifyContent={'flex-start'}
    >
      {user.role === 'user' && <AuthUserHeader UserData={user} />}
      {user.role !== 'user' && <Header />}

      <Flex
        justify={'flex-start'}
        align={'flex-start'}
        direction={'column'}
        width={containerWidth}
        my={6}
        gap={5}
      >
        <Heading size={'lg'} color="brandblack" alignSelf="flex-start">
          Your Offer:
        </Heading>
        <Flex
          direction={'row'}
          gap={{ base: 6, md: 8 }}
          align="flex-start"
          justify="center"
          width="100%"
          wrap={{ base: 'wrap', xl: 'nowrap' }}
        >
          {offer && <VehicleOfferCard vehicle={offer} />}
          {user.role === 'user' && (
            <BookingForm balance={Number(offer ? offer.price : 0)} />
          )}
          {user.role !== 'user' && <BookingLoginPrompt />}
        </Flex>
      </Flex>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        width={containerWidth}
        gap={10}
        justify="center"
        align="flex-start"
        wrap={'wrap'}
      >
        <Box flex="1" width={{ base: '100%', lg: '65%' }}>
          <Heading fontSize="2xl" color={'brandblack'} mb={5}>
            Pickup Locations:
          </Heading>
          <CustomMap
            locations={offerLocations.locations}
            showInfoWindow={true}
          />
        </Box>

        <Box flex="1" width={{ base: '100%', lg: '50%' }}>
          <Heading fontSize="2xl" color={'brandblack'} mb={5}>
            Reviews:
          </Heading>
          <ReviewList
            reviews={reviewsData?.reviews}
            error={reviewsData?.error || reviewsError?.message}
          />
        </Box>
      </Flex>

      <Footer links={FooterLinks} />
    </Flex>
  );
}