import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import _ from "lodash";
import { v4 as uuid } from "uuid";

import {
  Grid,
  Autocomplete,
  InputAdornment,
  Button,
  TextField,
  Typography,
  createFilterOptions,
  IconButton,
  Avatar,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import TextFieldWrapper from "./common/TextField";
import { useAppSelector, useAppDispatch } from "../reducers/hooks";
import { Cocktail } from "../types/Cocktail";
// import FormProperty from './common/FormProperty';
import IngredientFormField from "./common/IngredientFormField";
import { databases } from "../appwrite/appwriteConfig";
import { setCocktailsUpdate } from "../reducers/appSlice";
import { useDebouncedCallback } from "use-debounce";

const INITIAL_FORM_STATE: Cocktail = {
  name: "",
  partEqualsOz: 0,
  mixers: [""],
  mixersPerServing: [0],
  extraIngredients: [""],
  extraIngredientsUnits: [""],
  extraIngredientsPerServing: [0],
  garnish: [""],
  garnishUnits: [""],
  garnishPerServing: [0],
};

const filter = createFilterOptions<Cocktail>();

const CocktailEditForm = ({
  dialogHandleClose,
}: {
  dialogHandleClose: any;
}) => {
  const stateCocktailsList = useAppSelector(
    (state: any) => state.cocktails.cocktails
  );
  const statePublicCocktailsList = useAppSelector(
    (state: any) => state.cocktails.public
  );

  const [formError, setFormError] = useState("");

  const dispatch = useAppDispatch();

  const handleOnChange = useDebouncedCallback(
    (cocktail: any, servings: any) => {
      //console.log("handleOnChange", cocktail);
      // dispatch(
      // 	updateCocktail({
      // 		...cocktail,
      // 		servings,
      // 		index: props.cIndex - 1,
      // 		fieldID: props.fieldID,
      // 	})
      // );
    },
    150
  );

  // useEffect(() => {
  //   if (stateCocktailsList) {
  //     let promise: Promise<any>[] = [];
  //     stateCocktailsList.map((cocktail: Cocktail, index: number) => {
  //       const uniqueID = uuid();
  //       if (cocktail.$id) {
  //         const theCocktail = {
  //           cocktail_id: cocktail.$id,
  //           name: cocktail.name,
  //           category: cocktail.category,
  //           liquor: cocktail.liquor,
  //           garnish: cocktail.garnish,
  //           extraIngredients: cocktail.extraIngredients,
  //           mixers: cocktail.mixers,
  //           img: cocktail.img,
  //         };
  //         console.log("theCocktail", theCocktail);
  //         promise[index] = databases.createDocument(
  //           "62e751ad5c4167bdba50", //database_id
  //           "634dd9c197956ef891ac", //collection_id - Public Cocktails
  //           theCocktail.cocktail_id,
  //           theCocktail
  //         );
  //       }

  //       promise[index]?.then(
  //         function (response) {
  //           console.log(response); // Success
  //           // //dispatch(setCocktailsUpdate(1));
  //           // dialogHandleClose();
  //         },
  //         function (error) {
  //           console.log(error); // Failure
  //           console.log("error.message", error.message); // Failure
  //           setFormError(error.message);
  //         }
  //       );
  //     });
  //   }
  // }, [stateCocktailsList]);

  const onSubmit = (values: Cocktail) => {
    //console.log("form values being sent to database", values);
    const theCocktail = {
      img: values.img,
      name: values.name,
      category: values.category,
      liquor: values.liquor,
      liquorParts: values.liquorParts,
      garnish: values.garnish,
      extraIngredients: values.extraIngredients,
      recipe: values.recipe,
      servingSizeOz: values.servingSizeOz,
      mixers: values.mixers,
      mixersPerServing: values.mixersPerServing,
      garnishPerServing: values.garnishPerServing,
      extraIngredientsPerServing: values.extraIngredientsPerServing,
      garnishUnits: values.garnishUnits,
      extraIngredientsUnits: values.extraIngredientsUnits,
      partEqualsOz: values.partEqualsOz,
    };
    let promise;
    let promise2;
    if (values.$id) {
      //update

      promise = databases.updateDocument(
        "62e751ad5c4167bdba50", //database_id
        "62e751d1a917793781dd", //collection_id - Cocktails
        values.$id,
        theCocktail
      );
      const thePublicCocktail = {
        cocktail_id: values.$id,
        name: values.name,
        category: values.category,
        liquor: values.liquor,
        garnish: values.garnish,
        extraIngredients: values.extraIngredients,
        mixers: values.mixers,
        img: values.img,
      };
      promise2 = databases.updateDocument(
        "62e751ad5c4167bdba50", //database_id
        "634dd9c197956ef891ac", //collection_id - Public Cocktails
        values.$id,
        thePublicCocktail
      );
    } else {
      //create
      const uniqueID = uuid();
      const thePublicCocktail = {
        cocktail_id: uniqueID,
        name: values.name,
        category: values.category,
        liquor: values.liquor,
        garnish: values.garnish,
        extraIngredients: values.extraIngredients,
        mixers: values.mixers,
        img: values.img,
      };
      promise = databases.createDocument(
        "62e751ad5c4167bdba50", //database_id
        "62e751d1a917793781dd", //collection_id
        uniqueID,
        theCocktail
      );
      promise2 = databases.createDocument(
        "62e751ad5c4167bdba50", //database_id
        "634dd9c197956ef891ac", //collection_id - Public Cocktails
        uniqueID,
        thePublicCocktail
      );
    }
    promise?.then(
      function (response) {
        console.log(response); // Success
        dispatch(setCocktailsUpdate(1));
        dialogHandleClose();
      },
      function (error) {
        console.log(error); // Failure
        console.log("error.message", error.message); // Failure
        setFormError(error.message);
      }
    );
    promise2?.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
        console.log("error.message", error.message); // Failure
        setFormError(error.message);
      }
    );
  };

  const onDelete = (cocktailID: string) => {
    const promise = databases.deleteDocument(
      "62e751ad5c4167bdba50", //database_id
      "62e751d1a917793781dd", //collection_id - Cocktails
      cocktailID //document_id
    );
    const promise2 = databases.deleteDocument(
      "62e751ad5c4167bdba50", //database_id
      "634dd9c197956ef891ac", //collection_id - Public Cocktails
      cocktailID //document_id
    );
    promise?.then(
      function (response) {
        console.log(response); // Success
        dispatch(setCocktailsUpdate(1));
        dialogHandleClose();
      },
      function (error) {
        console.log(error); // Failure
        console.log("error.message", error.message); // Failure
        setFormError(error.message);
      }
    );
    promise2?.then(
      function (response) {
        console.log(response); // Success
        dispatch(setCocktailsUpdate(1));
        dialogHandleClose();
      },
      function (error) {
        console.log(error); // Failure
        console.log("error.message", error.message); // Failure
        setFormError(error.message);
      }
    );
  };

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        enableReinitialize
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ setFieldValue, values, resetForm }) => (
          <Form>
            <Grid
              className="cocktailEditform"
              container
              sx={{
                alignItems: { sm: "center", xs: "flex-start" },
                flexDirection: "column",
              }}
            >
              <Grid
                item
                className="name"
                sx={{ margin: "8px 0px", width: "500px", maxWidth: "100%" }}
              >
                <Autocomplete
                  disableClearable
                  blurOnSelect
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  defaultValue={values.name || ""}
                  options={[...stateCocktailsList, values]}
                  groupBy={(cocktail: any) => cocktail.category}
                  getOptionLabel={(cocktail: any) => {
                    if (typeof cocktail === "string") {
                      return cocktail;
                    }
                    if (cocktail.inputValue) {
                      return cocktail.inputValue;
                    }
                    return cocktail.name;
                  }}
                  onChange={(e: any, value: Cocktail) => {
                    // handleOnChange(value, servings);
                    console.log("autocomplete onChange", value);
                    console.log("autocomplete all values", values);

                    if (typeof value === "string") {
                      console.log("setFieldValue('name', value)", value);
                      setFieldValue("name", value);
                    } else if (
                      value.inputValue ||
                      values.inputValue ||
                      value.name ||
                      values.name
                    ) {
                      console.log(
                        "setFieldValue('name', value.name)",
                        value.inputValue ||
                          values.inputValue ||
                          value.name ||
                          values.name
                      );
                      setFieldValue(
                        "name",
                        value.inputValue ||
                          values.inputValue ||
                          value.name ||
                          values.name
                      );
                    } else {
                      console.log(
                        "setFieldValue('name', INITIAL_FORM_STATE.name)",
                        INITIAL_FORM_STATE.name
                      );
                      setFieldValue("name", INITIAL_FORM_STATE.name);
                    }

                    if (_.find(stateCocktailsList, ["name", value.name])) {
                      console.log(
                        "_.find(stateCocktailsList, ['name', value.name])",
                        _.find(stateCocktailsList, ["name", value.name])
                      );
                      //set all field values to the cocktail selected
                      resetForm({ values: value });
                    }

                    //console.log('values.cocktail', cocktail);
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                      (option) => inputValue === option.title
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        //title: `Add "${inputValue}"`,
                      });
                    }

                    return filtered;
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
                        <Avatar src={option.img} sx={{ marginRight: "4px" }} />
                        <Typography
                          sx={{
                            margin: "0 4px",
                          }}
                        >
                          {option.name || option.inputValue}
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
                      label={`Cocktail Name`}
                      name={"name"}
                    />
                  )}
                ></Autocomplete>

                {/* <TextFieldWrapper name='name' label='Cocktail Name' /> */}
              </Grid>
              <Grid
                item
                className="img"
                sx={{ margin: "8px 0", width: "500px", maxWidth: "100%" }}
              >
                <TextFieldWrapper
                  name="img"
                  label="Image URL"
                  value={values.img || ""}
                />
              </Grid>
              <Grid
                item
                className="category"
                sx={{ margin: "8px 0", width: "500px", maxWidth: "100%" }}
              >
                <Autocomplete
                  sx={{ width: "100%" }}
                  //id={'category' + props.cIndex}
                  disableClearable
                  blurOnSelect
                  value={values.category || ""}
                  options={[
                    "Mezcal",
                    "Tequila",
                    "Gin",
                    "Vodka",
                    "Whiskey",
                    "Rum",
                    "Low ABV Cocktails",
                  ]}
                  getOptionLabel={(category: string) => category}
                  onChange={(e: any, value: any) => {
                    //console.log(value);
                    setFieldValue(
                      "category",
                      value !== null ? value : INITIAL_FORM_STATE.category
                    );
                    //console.log('values.category', category);
                  }}
                  renderInput={(params: any) => (
                    <TextFieldWrapper
                      {...params}
                      sx={{ width: "100%" }}
                      variant="standard"
                      label={`Category`}
                      name={"category"}
                    />
                  )}
                ></Autocomplete>
              </Grid>
              <Grid
                container
                className="partEqualsOz"
                flexDirection="row"
                sx={{ margin: "8px 0", width: "500px", maxWidth: "100%" }}
              >
                <Grid item>
                  <Typography sx={{ margin: "3px 8px 0 0" }}>
                    1 part equals
                  </Typography>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextFieldWrapper
                    name="partEqualsOz"
                    placeholder="#"
                    type="number"
                    value={values.partEqualsOz || ""}
                    inputProps={{
                      step: 0.5,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">oz.</InputAdornment>
                      ),
                    }}
                    onChange={(value: number) =>
                      setFieldValue(
                        "partEqualsOz",
                        value !== null ? value : INITIAL_FORM_STATE.partEqualsOz
                      )
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                item
                container
                className="liquor"
                sx={{
                  margin: "8px 0",
                  width: "500px",
                  maxWidth: "100%",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Grid item xs={4} sm={2}>
                  <TextFieldWrapper
                    name="liquorParts"
                    placeholder="#"
                    type="number"
                    value={values.liquorParts || ""}
                    inputProps={{
                      step: 0.5,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {values.liquorParts && values.liquorParts <= 1
                            ? "part"
                            : "parts"}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(value: number) =>
                      setFieldValue(
                        "liquorParts",
                        value !== null ? value : INITIAL_FORM_STATE.liquorParts
                      )
                    }
                  />
                </Grid>
                <Grid item xs={7.5} sm={9.5}>
                  <Autocomplete
                    sx={{ width: "100%" }}
                    //id={'liquor' + props.cIndex}
                    disableClearable
                    blurOnSelect
                    value={values.liquor || ""}
                    options={_.sortBy(
                      _.uniq(
                        _.map(stateCocktailsList, (cocktail) => {
                          if (cocktail.liquor) {
                            return cocktail.liquor;
                          } else return "";
                        })
                      )
                    )}
                    freeSolo
                    //getOptionLabel={(liquor: string) => liquor}
                    onChange={(e: any, value: any) => {
                      //console.log(value);
                      setFieldValue(
                        "liquor",
                        value !== null ? value : INITIAL_FORM_STATE.liquor
                      );
                      //console.log('values.liquor', liquor);
                    }}
                    renderInput={(params: any) => (
                      <TextFieldWrapper
                        {...params}
                        sx={{ width: "100%" }}
                        variant="standard"
                        label={`Liquor (2 oz.)`}
                        name={"liquor"}
                      />
                    )}
                  ></Autocomplete>
                </Grid>
              </Grid>

              <>
                {values.mixers?.map((value, index) => {
                  return (
                    <IngredientFormField
                      key={index}
                      index={index}
                      label="Mixer"
                      field="mixers"
                      value={value}
                      values={values}
                      setFieldValue={setFieldValue}
                    ></IngredientFormField>
                  );
                })}
                {values.extraIngredients?.map((value, index) => {
                  return (
                    <IngredientFormField
                      key={index}
                      index={index}
                      label="Extra Ingredients"
                      field="extraIngredients"
                      value={value}
                      values={values}
                      setFieldValue={setFieldValue}
                    ></IngredientFormField>
                  );
                })}
                {values.garnish?.map((value, index) => {
                  return (
                    <IngredientFormField
                      key={index}
                      index={index}
                      label="Garnish"
                      field="garnish"
                      value={value}
                      values={values}
                      setFieldValue={setFieldValue}
                    ></IngredientFormField>
                  );
                })}
              </>
              <Grid
                item
                className="recipe"
                sx={{ margin: "8px 0px", width: "500px", maxWidth: "100%" }}
              >
                <TextFieldWrapper
                  name="recipe"
                  label="Recipe"
                  multiline
                  value={values.recipe || ""}
                />
              </Grid>
            </Grid>
            {/* END .cocktailEditForm */}
            <Grid
              container
              sx={{ margin: "8px auto", width: "500px", maxWidth: "100%" }}
            >
              <Button
                type="submit"
                sx={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontFamily: "Bree",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  color: "var(--purple)",
                  border: "2px solid var(--purple)",
                  backgroundColor: "transparent",
                  minWidth: "250px",
                  "&:hover": {
                    backgroundColor: "var(--purple)",
                    color: "#fff",
                  },
                }}
                // onClick={(values) => {
                // 	onSubmit(values as Cocktail);
                // }}
              >
                {values.$id ? (
                  <>Update {values.name}</>
                ) : (
                  <>Create {values.name}</>
                )}
              </Button>
              {values.$id && (
                <IconButton
                  onClick={() => {
                    if (values.$id) {
                      onDelete(values.$id);
                    }
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255, 0, 51, 0.08)" },
                  }}
                >
                  <DeleteForeverIcon sx={{ color: "red" }}></DeleteForeverIcon>
                </IconButton>
              )}

              {formError && (
                <Grid item>
                  <Typography sx={{ color: "red" }}>{formError}</Typography>
                </Grid>
              )}
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

CocktailEditForm.propTypes = {
  dialogHandleClose: PropTypes.func.isRequired,
};

export default CocktailEditForm;
