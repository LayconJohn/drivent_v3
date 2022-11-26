import { prisma } from "@/config";

async function listHotels() {
  return await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true
    }
  });
}

async function findHotelById(id: number) {
  return await prisma.hotel.findFirst({
    where: { id: id }
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

const hotelsRepository = {
  listHotels,
  findRoomsByHotelId,
  findHotelById
};

export default hotelsRepository;
