import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "@/config";
import supertest from "supertest";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createAndReturnHotelId,
  createRooms,
  createcustomTicketType,
  createHotels
} from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  describe("Authorization tests", () => {
    it("should response with status 401 if no token", async () => {
      const response = await server.get("/hotels");

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should response with status 401 when token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("sholud response with status 401 if there no session", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });
  });
  describe("When token is valid", () => {
    it("should response with status 404 if user don't have enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    });

    it("should response with status 401 when given ticket doesnt exist", async () => {
      const user = await createUser();
      const token = generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should reponse with status 400 when the ticket status is not PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should response with status 400 when the ticket type does not include accommodation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketTypeWithoutAcomodation = await createcustomTicketType(true, false);
      await createTicket(enrollment.id, ticketTypeWithoutAcomodation.id, TicketStatus.PAID);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should response with status 200 and hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createcustomTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotels();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String)
          })
        ])
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  describe("Authorization tests", () => {
    it("should response with status 401 if no token", async () => {
      const response = await server.get("/hotels/1");

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should response with status 401 when token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("sholud response with status 401 if there no session", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });
  });

  describe("When token is valid", () => {
    it("should response with status 404 if user don't have enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotelId = await createAndReturnHotelId();

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    });
 
    it("should response with status 401 when given ticket doesnt exist", async () => {
      const user = await createUser();
      const token = generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotelId = await createAndReturnHotelId();

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should reponse with status 400 when the ticket status is not PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should response with status 400 when the ticket type does not include accommodation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketTypeWithoutAcomodation = await createcustomTicketType(true, false);
      await createTicket(enrollment.id, ticketTypeWithoutAcomodation.id, TicketStatus.PAID);
      const hotelId = await createAndReturnHotelId();

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should response with status 404 when there is not hotel with this hotelId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createcustomTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotelId = Number(faker.random.numeric(5));

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toEqual({});
    });

    it("should response with status 200 and rooms data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createcustomTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotelId = await createAndReturnHotelId();
      await createRooms(hotelId);

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: [
          {
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]
      });
    });
  });
});
