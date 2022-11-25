import { prisma } from "@/config";

async function listHotels() {
  return await prisma.hotel.findFirst();
}

async function findRoomsByHotelId(hotelId: number) {
  return;
}

const hotelsRepository = {
  listHotels,
  findRoomsByHotelId,
};

export default hotelsRepository;
