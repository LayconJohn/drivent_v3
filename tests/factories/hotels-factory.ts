import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotels() {
  const hotels = [{ name: "Hotel Maneiro", image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/20152908.jpg?k=b36a747d0a774916c83f81067f3a7d929d48a832f8d16028d991feeb2d254488&o=&hp=1" }];

  return prisma.hotel.createMany({
    data: hotels
  });
}
