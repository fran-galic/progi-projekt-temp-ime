import { StarIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Box,
  Text,
  Image,
  Flex,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import CardMenuDot from '../cardMenu/CardMenuDot';
import { useRouter } from 'next/navigation';
import { IVehicle } from "@/typings/vehicles/vehicles.type";
import { CustomPost, CustomPut } from '@/fetchers/post';
import { swrKeys } from '@/fetchers/swrKeys';

export default function VehicleCard({ vehicle, handleDelete }: { 
  vehicle: IVehicle,
  handleDelete : (id: number) => void
}) {
  const router = useRouter();
  const [isDimmed, setIsDimmed] = useState(vehicle.isVisible);
  const [isHovered, setIsHovered] = useState(false);

  const handleHide = () => {
    CustomPut<void>(swrKeys.companyVehicleVisi + vehicle.vehicleId + '/')
    setIsDimmed(!isDimmed);
  };
  const handleOfferClick = () => {
    router.push(`/offer/${vehicle.offerId}`); 
  };
  const handleEditClick = () => {
    router.push({
      pathname: "edit/vehicle",
      query: { id : vehicle.vehicleId.toString(),
          registration : vehicle.registration,
          make : vehicle.makeName,
          model : vehicle.modelName
       },
    } as any);
  };
  const handleDeleteClick = () => {
    handleDelete(vehicle.vehicleId);
  }

  return (
    <Card
      as={NextLink}
      href={`${vehicle.registration}?id=${vehicle.vehicleId}`}
      maxW="210px"
      minW="180px"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={'brandwhite'}
      bg={'brandwhite'}
      px={2}
      _hover={{
        borderColor: 'brandblack',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      opacity={isDimmed ? 1 : 0.5}
    >
      {isHovered && (
        <CardMenuDot>
              <MenuItem onClick={handleOfferClick}>View offer</MenuItem>
              <MenuItem onClick={handleEditClick}>Edit vehicle</MenuItem>
              <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              <MenuItem onClick={handleHide}>{isDimmed && (<Text>Hide</Text>)} {!isDimmed && (<Text>Show</Text>)}</MenuItem>
        </CardMenuDot>
      )}

      <Image
        src={vehicle.image} // mozda dodat onaj neki nastavak prije
        alt={`${vehicle.modelName} car`}
        objectFit="cover"
        width="100%"
        height="110px" // Set a fixed height to make all images uniform
        borderRadius="md" // Optional: adds a nice rounded edge to the image
      />
      <Divider
        borderWidth="2px"
        borderColor="transparent"
        background="linear-gradient(to right, blue, lightblue)"
        height="1px"
      />
      <CardBody px={0} py={2}>
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Heading size="xs">
                {vehicle.makeName} {vehicle.modelName}
              </Heading>
            </Flex>

            <Text fontSize="0.8rem" p="0px 5px 5px 5px">
              {vehicle.registration}
            </Text>

            <Flex
              gap={'1px'}
              fontSize="xs"
              align="baseline"
              alignSelf="flex-end"
              ml={Number(vehicle.noOfReviews) > 99 ? 0 : 'auto'}
            >
              <StarIcon boxSize="3" />{' '}
              {/* Adjusts the star icon to be slightly smaller */}
              <Box>{vehicle.rating}</Box>
              <Text as="span">({vehicle.noOfReviews} reviews)</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
