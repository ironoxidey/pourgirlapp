import React, { useEffect, useState, FormEvent } from "react";
import PropTypes from "prop-types";
import { account, databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { Formik, Form } from "formik";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";

import TextFieldWrapper from "./common/TextField";

import { addCocktail, updateCocktail } from "../reducers/groceriesSlice";
import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../reducers/appSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Cocktail } from "../types/Cocktail";
import { Calculate } from "@mui/icons-material";

type FormState = {
  cocktail?: Cocktail;
  servings?: number;
  fieldID: string;
};
const INITIAL_FORM_STATE: FormState = {
  cocktail: {},
  servings: 1,
  fieldID: "",
};

type propsTypes = {
  id?: any;
  fieldID: string;
  removeCocktail: any;
  cIndex: number;
  ref: any;
  name?: string;
  servings?: number;
  cocktail?: Cocktail;
};

const ounces = 2; //of liquor per serving
const mLperOunce = 29.5735; //according to Google

const CocktailSelect = (props: propsTypes) => {
  // const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);

  const dispatch = useAppDispatch();
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [ouncesPerPart, setOuncesPerPart] = useState(1);

  // const [servingsFocus, setServingsFocus] = useState(false);

  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);
  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );
  const stateThisGroceryCocktail = useAppSelector((state: any) =>
    state.groceries.cocktails.find(
      (theCocktail: { fieldID: string; id: any }) =>
        theCocktail.fieldID === props.fieldID
    )
  );

  console.log("stateThisGroceryCocktail", stateThisGroceryCocktail);

  const handleOnChange = useDebouncedCallback(
    (cocktail: any, servings: any, eventTarget?: any) => {
      // console.log("appRightToMakeChanges", appRightToMakeChanges);
      // console.log("handleOnChange FORM", cocktail);
      // // console.log(
      // //   "document.activeElement",
      // //   document.activeElement?.getAttribute("name")
      // // );
      console.log(
        "handleOnChange eventTarget",
        eventTarget,
        "cocktail",
        cocktail,
        "servings",
        servings
      );

      if (
        eventTarget &&
        eventTarget.field === "cocktail" + props.cIndex &&
        appRightToMakeChanges === "FORM" &&
        appLastToMakeChanges === "FORM" &&
        (servings !== stateThisGroceryCocktail.servings || //make sure the new servings is different from the one in the current state
          cocktail.name !== stateThisGroceryCocktail.name) //or the new cocktail is different from one in the current state
      ) {
        dispatch(
          updateCocktail({
            ...cocktail,
            servings,
            index: props.cIndex - 1,
            fieldID: props.fieldID,
          })
        );
        // if (!servingsFocus) {
        // 	setTimeout(() => {
        // 		dispatch(setRightToMakeChanges('CHART'));
        // 	}, 5000);
        // }
      }
      if (
        eventTarget &&
        eventTarget.field === "cocktail" + props.cIndex + "servings" &&
        appRightToMakeChanges === "FORM" &&
        appLastToMakeChanges === "FORM" &&
        (servings !== stateThisGroceryCocktail.servings || //make sure the new servings is different from the one in the current state
          cocktail.name !== stateThisGroceryCocktail.name) //or the new cocktail is different from one in the current state
      ) {
        dispatch(
          updateCocktail({
            ...cocktail,
            servings,
            index: props.cIndex - 1,
            fieldID: props.fieldID,
          })
        );
        // if (!servingsFocus) {
        // 	setTimeout(() => {
        // 		dispatch(setRightToMakeChanges('CHART'));
        // 	}, 5000);
        // }
      }
    },
    150
  );
  const handleOnChangeTextFieldWrapper = //useDebouncedCallback(
    (cocktail: any, servings: any, eventTarget: any) => {
      if (
        servings &&
        servings > 0 &&
        servings !== stateThisGroceryCocktail.servings
      ) {
        if (appRightToMakeChanges === "FORM") {
          if (appLastToMakeChanges !== "FORM") {
            dispatch(setLastToMakeChanges("FORM"));
          }
          handleOnChange(cocktail, servings, eventTarget);
        }
        // setFieldValue("servings", servings);
      }
    }; //,
  //150:
  // );

  useEffect(() => {
    if (
      props.cocktail &&
      props.cocktail.partEqualsOz &&
      props.cocktail.partEqualsOz > 0
    ) {
      setOuncesPerPart(props.cocktail.partEqualsOz);
    }
  }, [props.cocktail]);

  useEffect(() => {
    const documents = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_COCKTAILS_COLLECTION_ID, //collection_id - Cocktails
      [Query.orderAsc("category"), Query.orderAsc("name"), Query.limit(100)] // queries
      // 100, // limit
      // 0, // offset
      // "", // cursor
      // "after", // cursorDirection
      // ["category", "name"], // orderAttributes
      // ["ASC", "ASC"] // orderTypes
    );

    documents.then(
      function (response) {
        // console.log(response); // Success
        setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, [stateApp]);

  if (stateThisGroceryCocktail)
    return (
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
          cocktail: props.cocktail,
          servings: stateThisGroceryCocktail?.servings || props.servings,
        }}
        // validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          // onSubmit(values);
        }}
      >
        {({ setFieldValue, values: { cocktail, servings } }) => (
          <Form
            style={{ width: "100%" }}
            //onChange={handleOnChange(cocktail, servings)}
            //onKeyUp={handleOnChange(cocktail, servings)}
          >
            <>
              {cocktails && cocktails.length > 0 && (
                <>
                  <Grid
                    className={"cocktail" + props.cIndex}
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
                      <HighlightOffTwoToneIcon
                        sx={{
                          color: "red",
                          backgroundColor: "#fff",
                          borderRadius: "30px",
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          props.removeCocktail(props.fieldID);
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
                        border: "2px solid var(--orange)",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        className="cocktailServings"
                        sx={{
                          width: "100%",
                          padding:
                            cocktail && cocktail.$id
                              ? "20px 20px 0"
                              : "20px 20px",
                          textAlign: "center",
                        }}
                      >
                        <Grid
                          item
                          className="cocktailSelect"
                          sx={{
                            width:
                              cocktail && cocktail.$id
                                ? "calc(100% - 20px - 150px)"
                                : "100%",
                            margin: "0 auto",
                            transition:
                              "width .3s cubic-bezier(0.23, 1, 0.32, 1)",
                          }}
                        >
                          <Autocomplete
                            id={"cocktail" + props.cIndex}
                            // name={"cocktail"}
                            disableClearable
                            blurOnSelect
                            defaultValue={
                              props.cocktail &&
                              props.cocktail.$id &&
                              props.cocktail
                            }
                            options={cocktails}
                            groupBy={(cocktail: any) => cocktail.category}
                            getOptionLabel={(cocktail: any) => cocktail.name}
                            // onFocus={() => {
                            //   dispatch(setRightToMakeChanges("FORM"));
                            // }}
                            onChange={(e: any, value: any) => {
                              console.log("autocomplete onChange e", e.target);
                              console.log("autocomplete onChange value", value);
                              const eventTarget = {
                                component: "FORM",
                                field: "cocktail" + props.cIndex,
                              };
                              handleOnChange(value, servings, eventTarget);

                              dispatch(setLastToMakeChanges("FORM"));

                              setFieldValue(
                                "cocktail",
                                value !== null
                                  ? value
                                  : INITIAL_FORM_STATE.cocktail
                              );

                              //console.log('values.cocktail', cocktail);
                            }}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                {/* <Tooltip
                                arrow={true}
                                placement="bottom-start"
                                title={
                                  <>
                                    <div>
                                      {option.liquor && (
                                        <>{toTitleCase(option.liquor)}</>
                                      )}
                                      {option.mixers &&
                                        option.mixers.length > -1 &&
                                        option.mixers.map(
                                          (mixer: string, index: number) => (
                                            <>
                                              {option.liquor || index > 0
                                                ? ", "
                                                : ""}
                                              {toTitleCase(mixer)}
                                            </>
                                          )
                                        )}
                                      {option.garnish &&
                                        option.garnish.map(
                                          (garnish: string, index: number) => (
                                            <>
                                              {option.liquor ||
                                              option.mixers ||
                                              index > 0
                                                ? ", "
                                                : ""}
                                              {toTitleCase(garnish)}
                                            </>
                                          )
                                        )}
                                      {option.extraIngredients &&
                                        option.extraIngredients.map(
                                          (
                                            extraIngredient: string,
                                            index: number
                                          ) => (
                                            <>
                                              {option.liquor ||
                                              option.mixers ||
                                              option.garnish ||
                                              index > 0
                                                ? ", "
                                                : ""}
                                              {toTitleCase(extraIngredient)}
                                            </>
                                          )
                                        )}
                                    </div>
                                  </>
                                }
                              > */}
                                <Grid container alignItems="center">
                                  <Avatar
                                    src={option.img}
                                    sx={{ marginRight: "4px" }}
                                  >
                                    <LocalBarTwoToneIcon></LocalBarTwoToneIcon>
                                  </Avatar>
                                  <Typography
                                    sx={{
                                      margin: "0 4px",
                                    }}
                                  >
                                    {option.name}
                                  </Typography>
                                </Grid>
                                {/* </Tooltip> */}
                              </li>
                            )}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                sx={{ width: "100%" }}
                                variant="standard"
                                label={`Cocktail #${props.cIndex}`}
                                name={"cocktail" + props.cIndex}
                                onChange={(event: any, value: any) => {
                                  console.log(
                                    "TextField onChange event",
                                    event
                                  );
                                }}
                                // onFocus={() => {
                                //   dispatch(setRightToMakeChanges("FORM"));
                                // }}
                              />
                            )}
                          ></Autocomplete>
                        </Grid>

                        <Grid
                          item
                          className="servings"
                          sx={{
                            width: cocktail && cocktail.$id ? "150px" : "0px",
                            marginLeft:
                              cocktail && cocktail.$id ? "20px" : "0px",
                            overflow: "hidden",
                            transition:
                              "all .3s cubic-bezier(0.23, 1, 0.32, 1)",
                          }}
                        >
                          <TextFieldWrapper
                            name="servings"
                            label="How many servings?"
                            type="number"
                            defaultValue={props.servings}
                            value={stateThisGroceryCocktail.servings}
                            onChange={handleOnChangeTextFieldWrapper(
                              cocktail,
                              servings,
                              {
                                component: "FORM",
                                field: "cocktail" + props.cIndex + "servings",
                              }
                            )}
                            // onFocus={() => {
                            //   dispatch(setRightToMakeChanges("FORM"));
                            //   setServingsFocus(true);
                            // }}
                            // onBlur={() => setServingsFocus(false)}
                          />
                        </Grid>
                      </Grid>
                      {cocktail && cocktail.$id && (
                        <Accordion
                          sx={{
                            width: "100%",
                            boxShadow: "none",
                            border: "none",
                            "&:before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon
                                sx={{
                                  color: "var(--green)",
                                }}
                              />
                            }
                            sx={{
                              color: "var(--green)",
                              "& .MuiAccordionSummary-content": {
                                justifyContent: "end",
                              },
                            }}
                          >
                            Ingredients
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid
                              container
                              flexDirection="column"
                              sx={{
                                justifyContent: "center",
                                padding: "0 20px 20px",
                                flexWrap: "nowrap",
                              }}
                              className="ingredients"
                            >
                              <Grid item className="liquorMixers">
                                <>
                                  {cocktail.liquor && cocktail.liquorParts && (
                                    <>
                                      {setOuncesPerPart(
                                        cocktail.partEqualsOz &&
                                          cocktail.partEqualsOz > 0
                                          ? cocktail.partEqualsOz
                                          : ounces / cocktail.liquorParts
                                      )}
                                      <Typography>
                                        {cocktail.liquorParts}{" "}
                                        {cocktail.liquorParts > 1
                                          ? `parts`
                                          : `part`}{" "}
                                        {cocktail.liquor}{" "}
                                        {servings &&
                                          servings > 0 &&
                                          " = " +
                                            Math.ceil(
                                              ouncesPerPart *
                                                cocktail.liquorParts *
                                                servings *
                                                100
                                            ) /
                                              100 +
                                            "oz" +
                                            " = " +
                                            Math.ceil(
                                              ouncesPerPart *
                                                cocktail.liquorParts *
                                                servings *
                                                mLperOunce
                                            ) +
                                            "mL"}
                                      </Typography>
                                    </>
                                  )}
                                  {cocktail.mixers &&
                                    cocktail.mixers.length > -1 &&
                                    cocktail.mixersPerServing &&
                                    cocktail.mixersPerServing.length > -1 &&
                                    cocktail.mixers.map(
                                      (mixer: string, index: number) => {
                                        if (
                                          cocktail.mixersPerServing &&
                                          cocktail.mixersPerServing[index]
                                        ) {
                                          {
                                            if (
                                              cocktail.partEqualsOz &&
                                              cocktail.partEqualsOz > 0
                                            ) {
                                              setOuncesPerPart(
                                                cocktail.partEqualsOz
                                              );
                                            }
                                          }
                                          return (
                                            <Typography>
                                              {cocktail.mixersPerServing[index]}{" "}
                                              {cocktail.mixersPerServing[
                                                index
                                              ] > 1
                                                ? `parts`
                                                : `part`}{" "}
                                              {mixer}{" "}
                                              {servings &&
                                                servings > 0 &&
                                                " = " +
                                                  Math.ceil(
                                                    ouncesPerPart *
                                                      cocktail.mixersPerServing[
                                                        index
                                                      ] *
                                                      servings *
                                                      100
                                                  ) /
                                                    100 +
                                                  "oz" +
                                                  " = " +
                                                  Math.ceil(
                                                    ouncesPerPart *
                                                      cocktail.mixersPerServing[
                                                        index
                                                      ] *
                                                      servings *
                                                      mLperOunce
                                                  ) +
                                                  "mL"}
                                            </Typography>
                                          );
                                        }
                                      }
                                    )}
                                  {/* {cocktail.garnish &&
                                cocktail.garnish.length > -1 &&
                                cocktail.garnishPerServing &&
                                cocktail.garnishPerServing.length > -1 &&
                                cocktail.garnish.map(
                                  (garnish: string, index: number) => {
                                    if (
                                      cocktail.garnishPerServing &&
                                      cocktail.garnishPerServing[index]
                                    ) {
                                      return (
                                        <Typography>
                                          {cocktail.garnishPerServing[index]}{" "}
                                          {garnish}{" "}
                                          {servings &&
                                            servings > 0 &&
                                            " = " +
                                              Math.ceil(
                                                cocktail.garnishPerServing[
                                                  index
                                                ] *
                                                  servings *
                                                  100
                                              ) /
                                                100}
                                        </Typography>
                                      );
                                    }
                                  }
                                )} */}
                                </>
                              </Grid>
                              {/* END .liquorMixers */}

                              <Grid
                                container
                                className="garnishExtras"
                                justifyContent="center"
                                direction="column"
                              >
                                {cocktail.garnish &&
                                  cocktail.garnish.map((garnish: string) => (
                                    <Grid item>{garnish}</Grid>
                                  ))}
                                {cocktail.extraIngredients &&
                                  cocktail.extraIngredients.map(
                                    (extraIngredient: string) => (
                                      <Grid item>{extraIngredient}</Grid>
                                    )
                                  )}
                              </Grid>
                            </Grid>
                            {/* END .ingredients */}
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {cocktail && cocktail.$id && (
                        <Grid
                          container
                          className="recipe"
                          sx={{
                            backgroundColor: "var(--orange)",
                            fontSize: ".8rem",
                            lineHeight: "1.3",
                            color: "#fff",
                            padding: "8px",
                          }}
                        >
                          Recipe: {cocktail.recipe}
                        </Grid>
                      )}
                    </Grid>
                    {/* END .cocktail# */}
                  </Grid>
                </>
              )}
            </>
          </Form>
        )}
      </Formik>
    );
  else return null;
};

CocktailSelect.propTypes = {
  cIndex: PropTypes.number.isRequired,
  ref: PropTypes.any,
  removeCocktail: PropTypes.func.isRequired,
  id: PropTypes.number,
  servings: PropTypes.number,
  cocktail: PropTypes.object,
};

export default CocktailSelect;
