import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.statusText === "BAD_REQUEST") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const hotelId = Number(req.params.hotelId);
  res.sendStatus(httpStatus.OK);
}
