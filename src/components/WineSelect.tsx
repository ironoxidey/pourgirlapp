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

import { addWine, updateWine } from "../reducers/groceriesSlice";
import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../reducers/appSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Wine } from "../types/Wine";

type FormState = {
  wine?: Wine;
  servings?: number;
  fieldID: string;
};
const INITIAL_FORM_STATE: FormState = {
  wine: {},
  servings: 1,
  fieldID: "",
};

const filter = createFilterOptions<Wine>();

type propsTypes = {
  fieldID: string;
  removeWine: any;
  cIndex: number;
  ref: any;
  name?: string;
  servings?: number;
};

const ounces = 2; //of alcohol per serving
const mLperOunce = 29.5735; //according to Google

const WineSelect = (props: propsTypes) => {
  // const stateApp = useAppSelector((state: any) => state.app.winesUpdate);

  const dispatch = useAppDispatch();
  // const [wines, setWines] = useState<any[]>([]);
  // const [ouncesPerPart, setOuncesPerPart] = useState(1.5);

  // const [servingsFocus, setServingsFocus] = useState(false);

  const stateApp = useAppSelector((state: any) => state.app.winesUpdate);
  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );
  const stateThisGroceryWine = useAppSelector((state: any) =>
    state.groceries.wines.find(
      (theWine: { fieldID: string; id: any }) =>
        theWine.fieldID === props.fieldID
    )
  );

  const handleOnChange = useDebouncedCallback(
    (wine: any, servings: any, eventTarget?: any) => {
      if (
        eventTarget &&
        (eventTarget.field === "wine" + props.cIndex ||
          eventTarget.field === "wine" + props.cIndex + "servings") &&
        appRightToMakeChanges === "FORM" &&
        appLastToMakeChanges === "FORM" &&
        (servings !== stateThisGroceryWine.servings || //make sure the new servings is different from the one in the current state
          wine.name !== stateThisGroceryWine.name) //or the new wine is different from one in the current state
      ) {
        console.log("handleOnChange FORM", wine);
        dispatch(
          updateWine({
            ...wine,
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
    (wine: any, servings: any, eventTarget: any) => {
      if (
        servings &&
        servings > 0 &&
        servings !== stateThisGroceryWine.servings
      ) {
        if (appRightToMakeChanges === "FORM") {
          if (appLastToMakeChanges !== "FORM") {
            dispatch(setLastToMakeChanges("FORM"));
          }
          handleOnChange(wine, servings, eventTarget);
        }
        // setFieldValue("servings", servings);
      }
    };

  if (stateThisGroceryWine)
    return (
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
          wine: { name: props.name },
          servings: props.servings,
        }}
        // validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          // onSubmit(values);
        }}
      >
        {({ setFieldValue, values: { wine, servings } }) => (
          <Form
            style={{ width: "100%" }}
            //onChange={handleOnChange(wine, servings)}
            //onKeyUp={handleOnChange(wine, servings)}
          >
            <>
              <>
                <Grid
                  className="wine"
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
                        props.removeWine(props.fieldID);
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
                      border: "2px solid var(--purple)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Grid
                      item
                      className="wine"
                      sx={{ margin: "8px auto", width: "150px" }}
                    >
                      <TextFieldWrapper
                        id="name"
                        label={`Wine #${props.cIndex}`}
                        name="wine.name"
                        defaultValue={props.name}
                        onChange={(e: any, value: any) => {
                          const eventTarget = {
                            component: "FORM",
                            field: "wine" + props.cIndex,
                          };
                          handleOnChange(value, servings, eventTarget);
                          //console.log('autocomplete onChange', value);

                          setFieldValue(
                            "wine",
                            value !== null
                              ? value
                              : props.name
                              ? props.name
                              : INITIAL_FORM_STATE.wine &&
                                INITIAL_FORM_STATE.wine.name
                          );

                          //console.log('values.wine', wine);
                        }}
                        // onFocus={() => {
                        //   // dispatch(setRightToMakeChanges("FORM"));
                        //   setServingsFocus(true);
                        // }}
                        // onBlur={() => setServingsFocus(false)}
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
                        value={stateThisGroceryWine.servings}
                        onChange={handleOnChangeTextFieldWrapper(
                          wine,
                          servings,
                          {
                            component: "FORM",
                            field: "wine" + props.cIndex + "servings",
                          }
                        )}
                        // onChange={handleOnChange(wine, servings)}
                        // onFocus={() => {
                        //   // dispatch(setRightToMakeChanges("FORM"));
                        //   setServingsFocus(true);
                        // }}
                        // onBlur={() => setServingsFocus(false)}
                      ></TextFieldWrapper>
                    </Grid>
                  </Grid>
                  {/* END .wine# */}
                </Grid>
              </>
            </>
          </Form>
        )}
      </Formik>
    );
  else return null;
};

WineSelect.propTypes = {
  cIndex: PropTypes.number.isRequired,
  ref: PropTypes.any,
  removeWine: PropTypes.func.isRequired,
  name: PropTypes.string,
  servings: PropTypes.number,
};

export default WineSelect;
