import {
  render,
  screen,
  // waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from "msw";
import { dummyCar, fullCarsURL } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
import CarsList from "../CarsList";

describe("CarsList Component", () => {
  test("it displays the loading state", async () => {
    const { debug } = render(<CarsList />);

    const loadingMessage = await screen.findByText(/Loading .../i);
    expect(loadingMessage).toBeInTheDocument();

    debug();
  });

  test("it renders correctly once loaded", async () => {
    const { debug } = render(<CarsList />);

    const carItem = await screen.findByText(new RegExp(dummyCar.name, "i"));
    expect(carItem).toBeInTheDocument();

    debug();
  });

  test("it handles errors", async () => {
    server.use(
      // override the initial "GET" request handler
      // to return a 500 Server Error
      rest.get(fullCarsURL, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    const { debug } = render(<CarsList />);
    const errorDisplay = await screen.findByText(
      new RegExp("Error: Failed to load", "i")
    );
    expect(errorDisplay).toBeInTheDocument();
    debug();
  });

  test("pressing the delete button removes the car", async () => {
    render(<CarsList />);
    const carItem = await screen.findByText(new RegExp(dummyCar.name, "i"));
    // console.log('waitForElementToBeRemoved', waitForElementToBeRemoved);
    const deleteButton = await screen.findByText(/Delete/i);
    fireEvent.click(deleteButton);

    // await waitFor(() => {
    //   expect(carItem).not.toBeInTheDocument();
    // });

    await waitForElementToBeRemoved(carItem);

  });
});
