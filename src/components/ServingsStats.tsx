//mostly identical to WineSelect.tsx
import React, { useEffect, useState, FormEvent } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../reducers/appSlice";

import {
  updateCocktail,
  updateWine,
  updateBeer,
} from "../reducers/groceriesSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Beer } from "../types/Beer";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";

type FormState = {
  //   totalServings?: number;
  numGuests?: number;
  servPerGuest?: number;
  totalHours?: number;
  servPerGuestPerHour?: number;
};
const INITIAL_FORM_STATE: FormState = {
  //   totalServings: 0,
  numGuests: 1,
  servPerGuest: 0,
  totalHours: 5,
  servPerGuestPerHour: 0,
};

// const filter = createFilterOptions<Beer>();

const ounces = 2; //of alcohol per serving
const mLperOunce = 29.5735; //according to Google

const ServingsStats = () => {
  // const stateApp = useAppSelector((state: any) => state.app.beersUpdate);

  const [initTotalServings, setInitTotalServings] = useState(0);
  const [totalServings, setTotalServings] = useState(0);
  const [numGuests, setNumGuests] = useState(100);
  const [servPerGuest, setServPerGuest] = useState(0);
  const [totalHours, setTotalHours] = useState(5);
  const [servPerGuestPerHour, setServPerGuestPerHour] = useState(0);

  const dispatch = useAppDispatch();

  const stateCocktailsLength = useAppSelector(
    (state: any) => state.groceries.cocktails.length
  );
  const stateWinesLength = useAppSelector(
    (state: any) => state.groceries.wines.length
  );
  const stateBeersLength = useAppSelector(
    (state: any) => state.groceries.beers.length
  );
  const stateGroceryCocktails = useAppSelector(
    (state: any) => state.groceries.cocktails
  );
  const stateGroceryWines = useAppSelector(
    (state: any) => state.groceries.wines
  );
  const stateGroceryBeers = useAppSelector(
    (state: any) => state.groceries.beers
  );

  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );

  //   const { setFieldValue } = useFormikContext();

  const calcNewTotalServings = () =>
    [
      ...[
        stateGroceryCocktails.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
      ...[
        stateGroceryWines.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
      ...[
        stateGroceryBeers.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
    ].reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    // console.log("appRightToMakeChanges", appRightToMakeChanges);

    const newTotalServings = calcNewTotalServings();
    if (appRightToMakeChanges !== "SERVINGS_STATS") {
      //   const newTotalServings = [
      //     ...[
      //       stateGroceryCocktails.reduce((acc: any, curr: { servings: any }) => {
      //         if (curr.servings > 0) {
      //           return acc + curr.servings;
      //         } else {
      //           return acc;
      //         }
      //       }, 0),
      //     ],
      //     ...[
      //       stateGroceryWines.reduce((acc: any, curr: { servings: any }) => {
      //         if (curr.servings > 0) {
      //           return acc + curr.servings;
      //         } else {
      //           return acc;
      //         }
      //       }, 0),
      //     ],
      //     ...[
      //       stateGroceryBeers.reduce((acc: any, curr: { servings: any }) => {
      //         if (curr.servings > 0) {
      //           return acc + curr.servings;
      //         } else {
      //           return acc;
      //         }
      //       }, 0),
      //     ],
      //   ].reduce((acc, curr) => acc + curr, 0);

      setTotalServings(newTotalServings);
    }
    setInitTotalServings(newTotalServings);
  }, [stateGroceryCocktails, stateGroceryWines, stateGroceryBeers]);

  useEffect(() => {
    // console.log("document.activeElement", document.activeElement?.name);
    if (
      totalServings &&
      numGuests &&
      //@ts-ignore
      document.activeElement?.name !== "servPerGuest"
    ) {
      setServPerGuest(totalServings / numGuests);
    }
  }, [totalServings, numGuests]);

  useEffect(() => {
    // console.log("document.activeElement", document.activeElement?.name);
    if (
      totalServings &&
      numGuests &&
      totalHours &&
      //@ts-ignore
      document.activeElement?.name !== "servPerGuestPerHour"
    ) {
      setServPerGuestPerHour(totalServings / numGuests / totalHours);
    }
  }, [totalServings, numGuests, totalHours]);

  useEffect(() => {
    // console.log("document.activeElement", document.activeElement?.name);
    //@ts-ignore
    if (document.activeElement?.name === "servPerGuest") {
      setTotalServings(servPerGuest * numGuests);
    }
  }, [servPerGuest]);

  useEffect(() => {
    // console.log("document.activeElement", document.activeElement?.name);
    //@ts-ignore
    if (document.activeElement?.name === "servPerGuestPerHour") {
      setTotalServings(servPerGuestPerHour * numGuests * totalHours);
    }
  }, [servPerGuestPerHour]);

  const [updateRatio, setUpdateRatio] = useState(1);

  const updateServings = () => {
    console.log("updating Servings");

    if (appLastToMakeChanges !== "SERVINGS_STATS") {
      dispatch(setLastToMakeChanges("SERVINGS_STATS"));
    }

    if (stateGroceryCocktails && stateGroceryCocktails.length > 0) {
      stateGroceryCocktails.map((cocktail: any) => {
        const newServings = Math.round(cocktail.servings * updateRatio);
        dispatch(
          updateCocktail({
            ...cocktail,
            servings: newServings,
          })
        );
      });
    }
    if (stateGroceryWines && stateGroceryWines.length > 0) {
      stateGroceryWines.map((wine: any) => {
        const newServings = Math.round(wine.servings * updateRatio);
        dispatch(
          updateWine({
            ...wine,
            servings: newServings,
          })
        );
      });
    }
    if (stateGroceryBeers && stateGroceryBeers.length > 0) {
      stateGroceryBeers.map((beer: any) => {
        const newServings = Math.round(beer.servings * updateRatio);
        dispatch(
          updateBeer({
            ...beer,
            servings: newServings,
          })
        );
      });
    }
  };

  useEffect(() => {
    if (
      appRightToMakeChanges === "SERVINGS_STATS" &&
      //   appLastToMakeChanges === "SERVINGS_STATS" &&
      initTotalServings &&
      totalServings
    ) {
      //if the new totalServings are more
      //   const updateRatio = totalServings / initTotalServings;
      setUpdateRatio(totalServings / initTotalServings);
      //   updateServings();
      //   console.log("updateRatio", updateRatio);
    }
    return () => setUpdateRatio(1);
  }, [totalServings]);

  //   const [beers, setBeers] = useState<any[]>([]);
  //   const [ouncesPerPart, setOuncesPerPart] = useState(1.5);

  //   const [servingsFocus, setServingsFocus] = useState(false);

  //   const stateApp = useAppSelector((state: any) => state.app.beersUpdate);

  //   const handleOnChange = useDebouncedCallback((servings: any) => {
  //     if (appRightToMakeChanges === "FORM") {
  //       console.log("handleOnChange FORM");
  //       //   dispatch(
  //       //     updateBeer({
  //       //       ...beer,
  //       //       servings,
  //       //       index: props.cIndex - 1,
  //       //       fieldID: props.fieldID,
  //       //     })
  //       //   );
  //     }
  //   }, 150);

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
        // beer: { name: props.name },
        // servings: props.servings,
      }}
      onSubmit={(values) => {
        // onSubmit(values);
      }}
    >
      {({ setFieldValue, values, handleChange }) => (
        <Form style={{ width: "100%" }}>
          <>
            <>
              <Grid
                item
                container
                className="servingStats"
                sx={{
                  border: "2px solid var(--teal)",
                  borderRadius: "10px",
                  maxWidth: "100%",
                  width: "100%",
                  padding: "20px 20px",
                }}
                onFocus={() =>
                  dispatch(setRightToMakeChanges("SERVINGS_STATS"))
                }
                onBlur={() => {
                  updateServings();
                  //   dispatch(setRightToMakeChanges("FORM"));
                }}
              >
                <Grid
                  item
                  container
                  sx={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "baseline",
                  }}
                  className={"statDiv"}
                >
                  <Typography component="h3">Total servings: </Typography>
                  <Typography component="p" sx={{ marginLeft: "5px" }}>
                    {totalServings}
                  </Typography>
                  {/* <TextField
                    variant="standard"
                    // name="totalServings"
                    value={totalServings}
                    type="number"
                    sx={{ width: "50px", marginLeft: "5px" }}
                  /> */}
                </Grid>

                <Grid
                  item
                  container
                  sx={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "baseline",
                  }}
                  className={"statDiv"}
                >
                  <Typography component="h3">Number of Guests:</Typography>

                  <TextField
                    variant="standard"
                    name="numGuests"
                    value={numGuests}
                    onChange={(event: any) => {
                      setNumGuests(event.target.value);
                    }}
                    // onChange={handleChange}
                    type="number"
                    sx={{ width: "50px", marginLeft: "5px" }}
                    inputProps={{
                      step: 1,

                      min: 1,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  container
                  sx={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "baseline",
                  }}
                  className={"statDiv"}
                >
                  <Typography component="h3">Total Hours:</Typography>
                  <TextField
                    variant="standard"
                    name="totalHours"
                    value={totalHours}
                    onChange={(event: any) => {
                      setTotalHours(event.target.value);
                    }}
                    // onChange={handleChange}
                    type="number"
                    sx={{ width: "50px", marginLeft: "5px" }}
                    inputProps={{
                      step: 0.25,
                      min: 0,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  container
                  sx={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "baseline",
                  }}
                  className={"statDiv"}
                >
                  <Typography component="h3">Servings per Guest:</Typography>
                  <TextField
                    variant="standard"
                    name="servPerGuest"
                    value={servPerGuest}
                    onChange={(event: any) => {
                      setServPerGuest(event.target.value);
                    }}
                    // onChange={handleChange}
                    type="number"
                    sx={{ width: "50px", marginLeft: "5px" }}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  container
                  sx={{
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "baseline",
                    position: "relative",
                  }}
                  className={"statDiv"}
                >
                  <TurnLeftIcon
                    className="subFieldIcon"
                    sx={{
                      transform: "rotate(180deg)",
                      color: "var(--teal)",
                      position: "relative",
                      top: "6px",
                    }}
                  ></TurnLeftIcon>
                  <Typography component="h3">per Hour:</Typography>
                  <TextField
                    variant="standard"
                    name="servPerGuestPerHour"
                    value={servPerGuestPerHour}
                    onChange={(event: any) => {
                      setServPerGuestPerHour(event.target.value);
                    }}
                    // onChange={handleChange}
                    type="number"
                    sx={{ width: "50px", marginLeft: "5px" }}
                    inputProps={{
                      step: 1,
                      min: 0,
                    }}
                  />
                </Grid>
              </Grid>
            </>
          </>
        </Form>
      )}
    </Formik>
  );
};

ServingsStats.propTypes = {};

export default ServingsStats;
