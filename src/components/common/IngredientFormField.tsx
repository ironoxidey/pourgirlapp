import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Autocomplete, Grid, IconButton, InputAdornment } from "@mui/material";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { useAppSelector } from "../../reducers/hooks";
import { Cocktail } from "../../types/Cocktail";
import TextFieldWrapper from "./TextField";

const INITIAL_FORM_STATE: Cocktail = {};

const IngredientFormField = ({
  index,
  label,
  field,
  value,
  values,
  setFieldValue,
}: {
  index: number;
  label: string;
  field: string;
  value?: string;
  values: Cocktail;
  setFieldValue: (field: string, value: any) => void;
}) => {
  const stateCocktailsList = useAppSelector(
    (state: any) => state.cocktails.cocktails
  );

  const duplicateField = (field: string) => {
    setFieldValue(`${field}[${index + 1}]`, "");
    console.log(values);
  };

  const fieldPerServing = (field + "PerServing") as keyof Cocktail;
  const fieldUnits = (field + "Units") as keyof Cocktail;

  return (
    <>
      <Grid
        item
        container
        className={`${field}[${index}]`}
        sx={{
          margin: "8px 0",
          width: "500px",
          maxWidth: "100%",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          xs={field !== "mixers" ? 1.25 : 2.75}
          sm={field !== "mixers" ? 1.25 : 2}
        >
          <TextFieldWrapper
            name={`${field}PerServing[${index}]`}
            placeholder="#"
            type="number"
            inputProps={{
              step: 0.5,
            }}
            value={values[fieldPerServing][index] || ""}
            InputProps={{
              endAdornment: (
                <>
                  {field === "mixers" && (
                    <InputAdornment position="end">
                      {fieldPerServing != undefined &&
                      index > -1 &&
                      values != undefined &&
                      values[fieldPerServing] &&
                      values[fieldPerServing][index] <= 1
                        ? "part"
                        : "parts"}
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            onChange={(value: number) =>
              setFieldValue(
                `${field}PerServing[${index}]`,
                value !== null ? value : 0
                // INITIAL_FORM_STATE[
                // 		`${field}PerServing[${index}]` as keyof Cocktail
                //   ]
              )
            }
          />
        </Grid>
        {field !== "mixers" && fieldUnits && (
          <Grid item xs={2.5}>
            <TextFieldWrapper
              name={`${field}Units[${index}]`}
              placeholder="unit/fraction"
              value={values[fieldUnits][index] || ""}
              onChange={(value: string) =>
                setFieldValue(
                  `${field}Units[${index}]`,
                  value !== null ? value : ""
                  // INITIAL_FORM_STATE[
                  // 		`${field}PerServing[${index}]` as keyof Cocktail
                  //   ]
                )
              }
            />
          </Grid>
        )}
        <Grid
          item
          xs={field !== "mixers" ? 6 : 6.75}
          sm={field !== "mixers" ? 6 : 7.5}
        >
          <Autocomplete
            sx={{ width: "100%" }}
            //id={'extraIngredients' + props.cIndex}
            disableClearable
            blurOnSelect
            // @ts-ignore: I don't think it recognizes that index is an index of values[fieldPerServing]
            value={values[field][index] || ""}
            options={
              field === "mixers"
                ? _.sortBy(
                    _.uniq(
                      //Creates a duplicate-free version of an array, using SameValueZero for equality comparisons, in which only the first occurrence of each element is kept. -- https://lodash.com/docs/4.17.15#uniq
                      _.flatMap(stateCocktailsList, (cocktail: Cocktail) => {
                        //Creates a flattened array of values by running each element in collection thru iteratee and flattening the mapped results. -- https://lodash.com/docs/4.17.15#flatMap
                        let mixersList: string[] = [];

                        // cocktail.mixer1 && mixersList.push(cocktail.mixer1);
                        // cocktail.mixer2 && mixersList.push(cocktail.mixer2);
                        // cocktail.mixer3 && mixersList.push(cocktail.mixer3);
                        // cocktail.mixer4 && mixersList.push(cocktail.mixer4);
                        cocktail.mixers &&
                          cocktail.mixers.forEach((mixer) => {
                            mixersList.push(mixer);
                          });

                        return mixersList;
                      })
                    )
                  )
                : _.sortBy(
                    _.uniq(
                      //Creates a duplicate-free version of an array, using SameValueZero for equality comparisons, in which only the first occurrence of each element is kept. -- https://lodash.com/docs/4.17.15#uniq
                      _.flatMap(stateCocktailsList, (cocktail: Cocktail) => {
                        //Creates a flattened array of values by running each element in collection thru iteratee and flattening the mapped results. -- https://lodash.com/docs/4.17.15#flatMap
                        return cocktail[field as keyof Cocktail];
                      })
                    )
                  )
            }
            freeSolo
            //getOptionLabel={(extraIngredients: string) => extraIngredients}
            onChange={(e: any, value: any) => {
              //console.log(value);
              setFieldValue(
                `${field}[${index}]`,
                value !== null
                  ? value
                  : INITIAL_FORM_STATE[field as keyof Cocktail]
              );
              //console.log('values.extraIngredients', extraIngredients);
            }}
            renderInput={(params: any) => (
              <TextFieldWrapper
                {...params}
                sx={{ width: "100%" }}
                variant="standard"
                label={`${label} #${index + 1}`}
                name={`${field}[${index}]`}
              />
            )}
          ></Autocomplete>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => duplicateField(field)}>
            <AddCircleIcon></AddCircleIcon>
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

IngredientFormField.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default IngredientFormField;
