import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik, useFormikContext } from "formik";
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
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";

import TextFieldWrapper from "./common/TextField";
import { useAppSelector, useAppDispatch } from "../reducers/hooks";
import { GroceryItem } from "../types/GroceryItem";
// import FormProperty from './common/FormProperty';
import IngredientFormField from "./common/IngredientFormField";
import ArrayFormField from "./common/ArrayFormField";
import { databases } from "../appwrite/appwriteConfig";
import { setCocktailsUpdate } from "../reducers/appSlice";
import { useDebouncedCallback } from "use-debounce";

const INITIAL_FORM_STATE: GroceryItem = {
  title: "",
  img: "",
  unit: "",
  container: "",
  unitsPerContainer: 0,
  servingsPerContainer: 0,
  whereToBuy: [""],
  avgPrice: 0,
  inputValue: "",
};

const filter = createFilterOptions<GroceryItem>();

const GroceryItemEditForm = ({
  dialogHandleClose,
  theGroceryItem,
}: {
  dialogHandleClose: Function;
  theGroceryItem: GroceryItem | undefined;
}) => {
  const stateGroceryItemsList = useAppSelector(
    (state: any) => state.groceries.items
  );

  // const { setFieldValue, resetForm } = useFormikContext();

  // const formik = useFormikContext();

  // useEffect(() => {
  //   // console.log("useFormikContext", formik);
  //   if (theGroceryItem && theGroceryItem.title && setFieldValue) {
  //     setFieldValue("title", theGroceryItem.title);
  //     resetForm({ values: theGroceryItem });
  //   }
  // }, [theGroceryItem]);

  const [formError, setFormError] = useState("");

  const dispatch = useAppDispatch();

  const handleOnChange = useDebouncedCallback(
    (groceryItem: any, servings: any) => {
      //console.log("handleOnChange", groceryItem);
      // dispatch(
      // 	updateCocktail({
      // 		...groceryItem,
      // 		servings,
      // 		index: props.cIndex - 1,
      // 		fieldID: props.fieldID,
      // 	})
      // );
    },
    150
  );

  const onSubmit = (values: GroceryItem) => {
    //console.log("form values being sent to database", values);
    const theGroceryItem = {
      title: values.title,
      img: values.img,
      unit: values.unit,
      container: values.container,
      unitsPerContainer: values.unitsPerContainer,
      servingsPerContainer: values.servingsPerContainer,
      whereToBuy: values.whereToBuy,
      avgPrice: values.avgPrice,
    };
    let promise;
    let promise2;
    if (values.$id) {
      //update

      promise = databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
        import.meta.env.VITE_APPWRITE_GROCERY_ITEMS_COLLECTION_ID, //collection_id - groceryItems
        values.$id,
        theGroceryItem
      );
    } else {
      //create
      const uniqueID = uuid();
      promise = databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
        import.meta.env.VITE_APPWRITE_GROCERY_ITEMS_COLLECTION_ID, //collection_id - groceryItems
        uniqueID,
        theGroceryItem
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
  };

  const onDelete = (groceryItemID: string) => {
    const promise = databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_GROCERY_ITEMS_COLLECTION_ID, //collection_id - groceryItems
      groceryItemID //document_id
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
              className="GroceryItemEditform"
              container
              sx={{
                alignItems: { sm: "flex-start", xs: "flex-start" },
                flexDirection: "column",
                width: "500px",
                margin: "0 auto",
              }}
            >
              <Grid
                item
                className="title"
                sx={{ margin: "8px 0px", width: "500px", maxWidth: "100%" }}
              >
                <Autocomplete
                  disableClearable
                  blurOnSelect
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  defaultValue={values.title || theGroceryItem?.title || ""}
                  options={[...stateGroceryItemsList, values]}
                  groupBy={(groceryItem: any) => groceryItem.container}
                  getOptionLabel={(groceryItem: any) => {
                    if (typeof groceryItem === "string") {
                      return groceryItem;
                    }
                    if (groceryItem.inputValue) {
                      return groceryItem.inputValue;
                    }
                    return groceryItem.title;
                  }}
                  onChange={(e: any, value: GroceryItem) => {
                    // handleOnChange(value, servings);
                    console.log("autocomplete onChange", value);
                    console.log("autocomplete all values", values);

                    if (typeof value === "string") {
                      console.log("setFieldValue('title', value)", value);
                      setFieldValue("title", value);
                    } else if (
                      value.inputValue ||
                      values.inputValue ||
                      value.title ||
                      values.title
                    ) {
                      console.log(
                        "setFieldValue('title', value.title)",
                        value.inputValue ||
                          values.inputValue ||
                          value.title ||
                          values.title
                      );
                      setFieldValue(
                        "title",
                        value.inputValue ||
                          values.inputValue ||
                          value.title ||
                          values.title
                      );
                    } else {
                      console.log(
                        "setFieldValue('title', INITIAL_FORM_STATE.title)",
                        INITIAL_FORM_STATE.title
                      );
                      setFieldValue("title", INITIAL_FORM_STATE.title);
                    }

                    if (_.find(stateGroceryItemsList, ["title", value.title])) {
                      console.log(
                        "_.find(stateGroceryItemsList, ['title', value.title])",
                        _.find(stateGroceryItemsList, ["title", value.title])
                      );
                      //set all field values to the groceryItem selected
                      resetForm({ values: value });
                    }

                    //console.log('values.groceryItem', groceryItem);
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
                      <Grid container alignItems="center">
                        <Avatar src={option.img} sx={{ marginRight: "4px" }}>
                          <LocalBarTwoToneIcon></LocalBarTwoToneIcon>
                        </Avatar>
                        <Typography
                          sx={{
                            margin: "0 4px",
                          }}
                        >
                          {option.title || option.inputValue}
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
                      label={`Item Title`}
                      name={"title"}
                    />
                  )}
                ></Autocomplete>
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
                container
                className="itemPicAndDetails"
                sx={{ flexDirection: "row" }}
              >
                <Grid item className="itemPic">
                  <img
                    src={values.img || ""}
                    alt=""
                    style={{ width: "225px" }}
                  />
                </Grid>
                <Grid
                  container
                  item
                  className="itemDetails"
                  sx={{ flexDirection: "column", width: "auto" }}
                >
                  <Grid
                    item
                    className="unit"
                    sx={{
                      margin: "8px 0",
                      // width: "500px",
                      maxWidth: "100%",
                      // alignItems: "flex-end",
                      // justifyContent: "space-between",
                    }}
                  >
                    <Autocomplete
                      sx={{ width: "100%" }}
                      //id={'unit' + props.cIndex}
                      disableClearable
                      blurOnSelect
                      value={values.unit || ""}
                      options={_.sortBy(
                        _.uniq(
                          _.map(stateGroceryItemsList, (groceryItem) => {
                            if (groceryItem.unit) {
                              return groceryItem.unit;
                            } else return "";
                          })
                        )
                      )}
                      freeSolo
                      //getOptionLabel={(unit: string) => unit}
                      onChange={(e: any, value: any) => {
                        //console.log(value);
                        setFieldValue(
                          "unit",
                          value !== null ? value : INITIAL_FORM_STATE.unit
                        );
                        //console.log('values.unit', unit);
                      }}
                      renderInput={(params: any) => (
                        <TextFieldWrapper
                          {...params}
                          sx={{ width: "100%" }}
                          variant="standard"
                          label={`Unit of measurement`}
                          name={"unit"}
                        />
                      )}
                    ></Autocomplete>
                  </Grid>
                  <Grid
                    item
                    container
                    className="container"
                    sx={{
                      margin: "8px 0",
                      // width: "500px",
                      maxWidth: "100%",
                      // alignItems: "flex-end",
                      // justifyContent: "space-between",
                    }}
                  >
                    <Autocomplete
                      sx={{ width: "100%" }}
                      //id={'container' + props.cIndex}
                      disableClearable
                      blurOnSelect
                      value={values.container || ""}
                      options={_.sortBy(
                        _.uniq(
                          _.map(stateGroceryItemsList, (groceryItem) => {
                            if (groceryItem.container) {
                              return groceryItem.container;
                            } else return "";
                          })
                        )
                      )}
                      freeSolo
                      //getOptionLabel={(container: string) => container}
                      onChange={(e: any, value: any) => {
                        //console.log(value);
                        setFieldValue(
                          "container",
                          value !== null ? value : INITIAL_FORM_STATE.container
                        );
                        //console.log('values.container', container);
                      }}
                      renderInput={(params: any) => (
                        <TextFieldWrapper
                          {...params}
                          sx={{ width: "100%" }}
                          variant="standard"
                          label={`Container Type`}
                          name={"container"}
                        />
                      )}
                    ></Autocomplete>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      margin: "8px 0",
                    }}
                  >
                    <TextFieldWrapper
                      name="unitsPerContainer"
                      // placeholder="Units Per Container"
                      type="number"
                      value={values.unitsPerContainer || ""}
                      label={
                        values.unit && values.container
                          ? values.unit + ` per ` + values.container
                          : `Units per Container`
                      }
                      // inputProps={{
                      //   step: 0.1,
                      // }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {values.unit}
                          </InputAdornment>
                        ),
                      }}
                      onChange={(value: number) =>
                        setFieldValue(
                          "unitsPerContainer",
                          value !== null
                            ? value
                            : INITIAL_FORM_STATE.unitsPerContainer
                        )
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      margin: "8px 0",
                      display: "flex",

                      alignItems: "center",
                    }}
                  >
                    <TextFieldWrapper
                      name="avgPrice"
                      type="number"
                      value={values.avgPrice || ""}
                      label="Average Price"
                      // inputProps={{
                      //   step: 0.1,
                      // }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      onChange={(value: number) =>
                        setFieldValue(
                          "avgPrice",
                          value !== null ? value : INITIAL_FORM_STATE.avgPrice
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <>
                {values.whereToBuy?.map((value, index) => {
                  return (
                    <ArrayFormField
                      key={index}
                      index={index}
                      label="Where to Buy"
                      field="whereToBuy"
                      value={value}
                      values={values}
                      setFieldValue={setFieldValue}
                    ></ArrayFormField>
                  );
                })}
                {/* {values.extraIngredients?.map((value, index) => {
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
                */}
              </>
              {/* <Grid
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
              </Grid> */}
            </Grid>
            {/* END .GroceryItemEditForm */}
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
                // 	onSubmit(values as GroceryItem);
                // }}
              >
                {values.$id ? (
                  <>Update {values.title}</>
                ) : (
                  <>Create {values.title}</>
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

GroceryItemEditForm.propTypes = {
  dialogHandleClose: PropTypes.func.isRequired,
  theGroceryItem: PropTypes.object,
};

export default GroceryItemEditForm;
