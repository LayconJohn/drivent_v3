import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotels() {
  const hotels = [
    { name: "Hotel Maneiro", image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/20152908.jpg?k=b36a747d0a774916c83f81067f3a7d929d48a832f8d16028d991feeb2d254488&o=&hp=1" },
    { name: "Fasano", image: "https://images.trvl-media.com/lodging/32000000/31640000/31630400/31630347/f8c71351.jpg?impolicy=resizecrop&rw=598&ra=fit" }
  ];

  return prisma.hotel.createMany({
    data: hotels
  });
}

export async function createAndReturnHotelId() {
  const result = await prisma.hotel.create({
    data: { 
      name: "Hotel Maneiro", image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/20152908.jpg?k=b36a747d0a774916c83f81067f3a7d929d48a832f8d16028d991feeb2d254488&o=&hp=1" 
    }
  });

  return result.id;
}

export async function createRooms(hotelId: number) {
  const rooms = [
    { name: "101", capacity: 1, hotelId: hotelId },
  ];
  return prisma.room.createMany({
    data: rooms
  });
}
