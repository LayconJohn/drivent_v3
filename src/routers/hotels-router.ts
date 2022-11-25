import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getRooms } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/:hotelId", getRooms)
  .get("", getHotels);

export { hotelsRouter };
