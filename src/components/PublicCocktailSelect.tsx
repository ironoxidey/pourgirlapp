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
  Tooltip,
  Avatar,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";
import { Calculate } from "@mui/icons-material";

import TextFieldWrapper from "./common/TextField";

import { addCocktail, updateCocktail } from "../reducers/groceriesSlice";
import { setRightToMakeChanges } from "../reducers/appSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Cocktail } from "../types/Cocktail";
import { toTitleCase } from "./common/toTitleCase";

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

  //const [servingsFocus, setServingsFocus] = useState(false);

  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);
  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const stateCocktails = useAppSelector(
    (state: any) => state.cocktails.cocktails
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

  // useEffect(() => {
  //   const documents = databases.listDocuments(
  //     "62e751ad5c4167bdba50", //database_id
  //     "62e751d1a917793781dd", // collectionId
  //     [Query.orderAsc("category"), Query.orderAsc("name"), Query.limit(100)] // queries
  //     // 100, // limit
  //     // 0, // offset
  //     // "", // cursor
  //     // "after", // cursorDirection
  //     // ["category", "name"], // orderAttributes
  //     // ["ASC", "ASC"] // orderTypes
  //   );

  //   documents.then(
  //     function (response) {
  //       // console.log(response); // Success
  //       setCocktails(response.documents);
  //     },
  //     function (error) {
  //       console.log(error); // Failure
  //     }
  //   );
  // }, [stateApp]);
  useEffect(() => {
    setCocktails(stateCocktails);
  }, [stateCocktails]);

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
                    className="cocktailContents"
                    sx={{
                      justifyContent: "center",
                      border: "2px solid var(--orange)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    {cocktail && cocktail.img && (
                      <Grid item>
                        <Avatar
                          src={cocktail && cocktail.img}
                          sx={{
                            marginLeft: "10px",
                            width: "75px",
                            height: "75px",
                          }}
                        />
                      </Grid>
                    )}
                    <Grid container>
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
                            // onFocus={() => {
                            //   dispatch(setRightToMakeChanges("FORM"));
                            // }}
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
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Tooltip
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
                                                {(option.liquor || index > 0) &&
                                                mixer != ""
                                                  ? ", "
                                                  : ""}
                                                {toTitleCase(mixer)}
                                              </>
                                            )
                                          )}
                                        {option.garnish &&
                                          option.garnish.map(
                                            (
                                              garnish: string,
                                              index: number
                                            ) => (
                                              <>
                                                {(option.liquor ||
                                                  option.mixers ||
                                                  index > 0) &&
                                                garnish != ""
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
                                                {(option.liquor ||
                                                  option.mixers ||
                                                  option.garnish ||
                                                  index > 0) &&
                                                extraIngredient != ""
                                                  ? ", "
                                                  : ""}
                                                {toTitleCase(extraIngredient)}
                                              </>
                                            )
                                          )}
                                      </div>
                                    </>
                                  }
                                >
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
                                </Tooltip>
                              </li>
                            )}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                sx={{ width: "100%" }}
                                variant="standard"
                                label={`Cocktail #${props.cIndex}`}
                                name={"cocktail" + props.cIndex}
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
                            onChange={handleOnChange(cocktail, servings)}
                            // onFocus={() => {
                            //   dispatch(setRightToMakeChanges("FORM"));
                            //   setServingsFocus(true);
                            // }}
                            // onBlur={() => setServingsFocus(false)}
                          ></TextFieldWrapper>
                        </Grid>
                      </Grid>
                      {cocktail && cocktail.$id && (
                        <>
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
                            {cocktail.liquor && (
                              <>{toTitleCase(cocktail.liquor)}</>
                            )}
                            {cocktail.mixers &&
                              cocktail.mixers.length > 0 &&
                              cocktail.mixers.map(
                                (mixer: string, index: number) => (
                                  <>
                                    {cocktail.liquor || index > 0 ? ", " : ""}
                                    {toTitleCase(mixer)}
                                  </>
                                )
                              )}
                            {cocktail.garnish &&
                              cocktail.garnish.length > 0 &&
                              cocktail.garnish.map(
                                (garnish: string, index: number) => (
                                  <>
                                    {(cocktail.liquor ||
                                      cocktail.mixers ||
                                      index > 0) &&
                                    garnish != ""
                                      ? ", "
                                      : ""}
                                    {toTitleCase(garnish)}
                                  </>
                                )
                              )}
                            {cocktail.extraIngredients &&
                              cocktail.extraIngredients.length > 0 &&
                              cocktail.extraIngredients.map(
                                (extraIngredient: string, index: number) => (
                                  <>
                                    {(cocktail.liquor ||
                                      cocktail.mixers ||
                                      cocktail.garnish ||
                                      index > 0) &&
                                    extraIngredient != ""
                                      ? ", "
                                      : ""}
                                    {toTitleCase(extraIngredient)}
                                  </>
                                )
                              )}
                            {/* END .liquorMixers */}
                          </Grid>
                          {/* END .ingredients */}
                        </>
                      )}
                    </Grid>
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
