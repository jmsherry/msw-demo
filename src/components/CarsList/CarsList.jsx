import React, { useState, useEffect, useCallback } from "react";

const CarsList = () => {
  const [state, setState] = useState({
    cars: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        if (state.loading) return;
        setState({
          ...state,
          loading: true,
        });
        const response = await fetch("/api/v1/cars");
        if (!response.ok) throw response;
        const data = await response.json();
        // console.log('data', data);
        setState({
          ...state,
          cars: data.cars,
          loading: false,
        });
      } catch (err) {
        console.log("load error", err);
        setState({
          ...state,
          error: err,
          loading: false,
        });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteCar = useCallback(
    async (id) => {
      try {
        console.log("deleting car", id);

        const response = await fetch(`/api/v1/cars/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("delete response", response);
        if (!response.ok) throw response;

        const idx = state.cars.findIndex(({ _id }) => _id === id);
        if (idx === -1) throw new Error(`Car with id ${id} not found.`);

        setState({
          ...state,
          cars: [...state.cars.slice(0, idx), ...state.cars.slice(idx + 1)],
        });
      } catch (err) {
        console.log("error", err);
        setState({
          ...state,
          error: err,
        });
      }
    },
    [state]
  );

  if (state.loading) return <p>Loading ...</p>;
  if (state.error) return <p>Error: Failed to load</p>;

  return (
    <ul>
      {state.cars.map(({ _id, name, bhp }) => (
        <li key={_id}>
          {name} ({bhp} bhp){" "}
          <button onClick={() => deleteCar(_id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default CarsList;
