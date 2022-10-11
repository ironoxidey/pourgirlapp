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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import TextFieldWrapper from "./common/TextField";

import { addCocktail, updateCocktail } from "../reducers/groceriesSlice";
import { setRightToMakeChanges } from "../reducers/appSlice";

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

  const [servingsFocus, setServingsFocus] = useState(false);

  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);
  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );

  const handleOnChange = useDebouncedCallback(
    (cocktail: any, servings: any) => {
      if (appRightToMakeChanges === "FORM") {
        //console.log("handleOnChange FORM", cocktail);
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
      "62e751d1a917793781dd", // collectionId
      [], // queries
      100, // limit
      0, // offset
      "", // cursor
      "after", // cursorDirection
      ["category", "name"], // orderAttributes
      ["ASC", "ASC"] // orderTypes
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

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
        cocktail: props.cocktail,
        servings: props.servings,
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
                          onFocus={() => {
                            dispatch(setRightToMakeChanges("FORM"));
                          }}
                          onChange={(e: any, value: any) => {
                            handleOnChange(value, servings);
                            //console.log('autocomplete onChange', value);

                            setFieldValue(
                              "cocktail",
                              value !== null
                                ? value
                                : INITIAL_FORM_STATE.cocktail
                            );

                            //console.log('values.cocktail', cocktail);
                          }}
                          renderInput={(params: any) => (
                            <TextField
                              {...params}
                              sx={{ width: "100%" }}
                              variant="standard"
                              label={`Cocktail #${props.cIndex}`}
                              name={"cocktail" + props.cIndex}
                              onFocus={() => {
                                dispatch(setRightToMakeChanges("FORM"));
                              }}
                            />
                          )}
                        ></Autocomplete>
                      </Grid>

                      <Grid
                        item
                        className="servings"
                        sx={{
                          width: cocktail && cocktail.$id ? "150px" : "0px",
                          marginLeft: cocktail && cocktail.$id ? "20px" : "0px",
                          overflow: "hidden",
                          transition: "all .3s cubic-bezier(0.23, 1, 0.32, 1)",
                        }}
                      >
                        <TextFieldWrapper
                          name="servings"
                          label="How many servings?"
                          type="number"
                          defaultValue={props.servings}
                          onChange={handleOnChange(cocktail, servings)}
                          onFocus={() => {
                            dispatch(setRightToMakeChanges("FORM"));
                            setServingsFocus(true);
                          }}
                          onBlur={() => setServingsFocus(false)}
                        ></TextFieldWrapper>
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
                                            {cocktail.mixersPerServing[index] >
                                            1
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
