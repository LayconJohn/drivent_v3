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
  return prisma.hotel.findUnique({
    where: { 
      id: id 
    }
  });
}

async function listRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true
    }
  });
}

const hotelsRepository = {
  listHotels,
  listRoomsByHotelId,
  findHotelById
};

export default hotelsRepository;
