import { notFoundError, unauthorizedError, requestError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
 
async function getHotels(userId: number) {
  if (!userId) {
    throw unauthorizedError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket.id) {
    throw unauthorizedError();
  }
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw requestError(400, "BAD_REQUEST");
  }
  if (ticket.status !== "PAID") {
    throw requestError(400, "BAD_REQUEST");
  }
  const hotels = await hotelsRepository.listHotels();
  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  if (!userId) {
    throw unauthorizedError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket.id) {
    throw unauthorizedError();
  }
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw requestError(400, "BAD_REQUEST");
  }
  if (ticket.status !== "PAID") {
    throw requestError(400, "BAD_REQUEST");
  }
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) {
    throw requestError(400, "BAD_REQUEST");
  }

  const rooms = await hotelsRepository.findRoomsByHotelId(hotelId);
  if (!rooms) {
    throw notFoundError();
  }
  return rooms; 
}

const hotelsService = {
  getHotels,
  getRoomsByHotelId
};

export default hotelsService;
