// src/mocks/handlers.js
import { rest } from "msw";
import { v4 as uuidv4 } from "uuid";

const baseAPIRoute = `/api`;
const API_Version = `/v1`;
const APIStemURL = `${baseAPIRoute}${API_Version}`;
const endpointFragment = "/cars";
export const fullCarsURL = `${APIStemURL}${endpointFragment}`;

const CARS_STORAGE_KEY = "cars";

export const dummyCar = { _id: uuidv4(), name: "test", bhp: 123 };

sessionStorage.setItem(CARS_STORAGE_KEY, JSON.stringify([dummyCar]));

const getCars = () => JSON.parse(sessionStorage.getItem(CARS_STORAGE_KEY));
const setCars = (cars) => sessionStorage.setItem(CARS_STORAGE_KEY, cars);

export const handlers = [
  rest.post(fullCarsURL, (req, res, ctx) => {
    const cars = getCars();
    console.log("body", req.body);
    const newCar = {
      _id: uuidv4(),
      ...req.body,
    };
    cars.push(newCar);
    setCars(cars);
    return res(ctx.status(201), ctx.json(newCar));
  }),

  rest.get(fullCarsURL, (req, res, ctx) => {
    const cars = getCars();

    return res(
      ctx.status(200),
      ctx.json({
        cars,
      })
    );
  }),

  rest.get(`${fullCarsURL}/:id`, (req, res, ctx) => {
    const cars = getCars();
    const { id } = req.params;
    const car = cars.find((car) => car._id === id);

    if (!car) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(car));
  }),

  rest.put(`${fullCarsURL}/:id`, (req, res, ctx) => {
    const cars = getCars();
    const { id } = req.params;
    const idx = cars.findIndex((car) => car._id === id);

    if (idx === -1) {
      return res(ctx.status(404));
    }

    const { body: changes } = req;

    const newCar = {
      ...cars[idx],
      ...changes,
    };

    cars[idx] = newCar;

    setCars(cars);

    return res(ctx.status(200));
  }),

  rest.delete(`${fullCarsURL}/:id`, (req, res, ctx) => {
    const cars = getCars();
    const { id } = req.params;
    console.log("delete call received for", id);
    const idx = cars.findIndex((car) => car._id === id);

    if (idx === -1) {
      console.log("not found");
      return res(ctx.status(404));
    }

    cars.splice(idx, 1);
    setCars(cars);
    console.log("successfull delete", cars);
    return res(ctx.status(204));
  }),
];
