//mostly identical to WineSelect.tsx
import React, { useEffect, useState, FormEvent } from "react";
import PropTypes from "prop-types";
import { account, databases } from "../appwrite/appwriteConfig";
import { Formik, Form } from "formik";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import TextFieldWrapper from "./common/TextField";

import { addBeer, updateBeer } from "../reducers/groceriesSlice";
import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../reducers/appSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Beer } from "../types/Beer";

type FormState = {
  beer?: Beer;
  servings?: number;
  fieldID: string;
};
const INITIAL_FORM_STATE: FormState = {
  beer: {},
  servings: 1,
  fieldID: "",
};

const filter = createFilterOptions<Beer>();

type propsTypes = {
  fieldID: string;
  removeBeer: any;
  cIndex: number;
  ref: any;
  name?: string;
  servings?: number;
};

const ounces = 2; //of alcohol per serving
const mLperOunce = 29.5735; //according to Google

const BeerSelect = (props: propsTypes) => {
  // const stateApp = useAppSelector((state: any) => state.app.beersUpdate);

  const dispatch = useAppDispatch();
  //   const [beers, setBeers] = useState<any[]>([]);
  //   const [ouncesPerPart, setOuncesPerPart] = useState(1.5);

  //   const [servingsFocus, setServingsFocus] = useState(false);

  const stateApp = useAppSelector((state: any) => state.app.beersUpdate);
  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );

  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );
  const stateThisGroceryBeer = useAppSelector((state: any) =>
    state.groceries.beers.find(
      (theBeer: { fieldID: string; id: any }) =>
        theBeer.fieldID === props.fieldID
    )
  );

  const handleOnChange = useDebouncedCallback(
    (beer: any, servings: any, eventTarget?: any) => {
      if (
        eventTarget &&
        (eventTarget.field === "beer" + props.cIndex ||
          eventTarget.field === "beer" + props.cIndex + "servings") &&
        appRightToMakeChanges === "FORM" &&
        appLastToMakeChanges === "FORM" &&
        (servings !== stateThisGroceryBeer.servings || //make sure the new servings is different from the one in the current state
          beer.name !== stateThisGroceryBeer.name) //or the new beer is different from one in the current state
      ) {
        console.log("handleOnChange FORM", beer);
        dispatch(
          updateBeer({
            ...beer,
            servings,
            index: props.cIndex - 1,
            fieldID: props.fieldID,
          })
        );
      }
    },
    150
  );

  const handleOnChangeTextFieldWrapper = //useDebouncedCallback(
    (beer: any, servings: any, eventTarget: any) => {
      if (
        servings &&
        servings > 0 &&
        servings !== stateThisGroceryBeer.servings
      ) {
        if (appRightToMakeChanges === "FORM") {
          if (appLastToMakeChanges !== "FORM") {
            dispatch(setLastToMakeChanges("FORM"));
          }
          handleOnChange(beer, servings, eventTarget);
        }
        // setFieldValue("servings", servings);
      }
    };

  if (stateThisGroceryBeer)
    return (
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
          beer: { name: props.name },
          servings: props.servings,
        }}
        onSubmit={(values) => {
          // onSubmit(values);
        }}
      >
        {({ setFieldValue, values: { beer, servings } }) => (
          <Form style={{ width: "100%" }}>
            <>
              <>
                <Grid
                  className="beer"
                  container
                  sx={{
                    position: "relative",
                    maxWidth: "500px",
                    margin: "8px auto",
                  }}
                  onFocus={() => {
                    dispatch(setRightToMakeChanges("FORM"));
                  }}
                >
                  <Box
                    className="deleteBtn"
                    sx={{
                      position: "absolute",
                      top: "-13px",
                      right: "-13px",
                      zIndex: "10",
                    }}
                  >
                    {/* red X button in the top-right corner */}
                    <HighlightOffTwoToneIcon
                      sx={{
                        color: "red",
                        backgroundColor: "#fff",
                        borderRadius: "30px",
                        fontSize: "30px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        props.removeBeer(props.fieldID);
                        // props.ref.current.removeChild(
                        // 	props.ref.current.children[props.cIndex - 1]
                        // );
                        //props.ref.current[props.cIndex - 1].innerHTML = '';
                      }}
                    ></HighlightOffTwoToneIcon>
                  </Box>
                  <Grid
                    container
                    sx={{
                      justifyContent: "center",
                      border: "2px solid var(--green)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Grid
                      item
                      className="beer"
                      sx={{ margin: "8px auto", width: "150px" }}
                    >
                      <TextFieldWrapper
                        id="name"
                        label={`Beer #${props.cIndex}`}
                        name="beer.name"
                        defaultValue={props.name}
                        onChange={(e: any, value: any) => {
                          const eventTarget = {
                            component: "FORM",
                            field: "beer" + props.cIndex,
                          };
                          handleOnChange(value, servings, eventTarget);
                          //console.log('autocomplete onChange', value);

                          setFieldValue(
                            "beer",
                            value !== null
                              ? value
                              : props.name
                              ? props.name
                              : INITIAL_FORM_STATE.beer &&
                                INITIAL_FORM_STATE.beer.name
                          );

                          //console.log('values.beer', beer);
                        }}
                        //   onFocus={() => {
                        //     // dispatch(setRightToMakeChanges('FORM'));
                        //     setServingsFocus(true);
                        //   }}
                        //   onBlur={() => setServingsFocus(false)}
                      ></TextFieldWrapper>
                    </Grid>
                    <Grid
                      item
                      className="servings"
                      sx={{ margin: "8px auto", width: "150px" }}
                    >
                      <TextFieldWrapper
                        name="servings"
                        defaultValue={props.servings}
                        label="How many servings?"
                        type="number"
                        value={stateThisGroceryBeer.servings}
                        onChange={handleOnChangeTextFieldWrapper(
                          beer,
                          servings,
                          {
                            component: "FORM",
                            field: "beer" + props.cIndex + "servings",
                          }
                        )}
                        //   onFocus={() => {
                        //     dispatch(setRightToMakeChanges("FORM"));
                        //     setServingsFocus(true);
                        //   }}
                        //   onBlur={() => setServingsFocus(false)}
                      ></TextFieldWrapper>
                    </Grid>
                  </Grid>
                  {/* END .beer# */}
                </Grid>
              </>
            </>
          </Form>
        )}
      </Formik>
    );
  else return null;
};

BeerSelect.propTypes = {
  cIndex: PropTypes.number.isRequired,
  ref: PropTypes.any,
  removeBeer: PropTypes.func.isRequired,
  name: PropTypes.string,
  servings: PropTypes.number,
};

export default BeerSelect;
