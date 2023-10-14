import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, Box, TextField, Autocomplete } from "@mui/material";
import pluralize from "pluralize";

import { useAppSelector } from "../reducers/hooks";

import _ from "lodash";
import { Cocktail } from "../types/Cocktail";
import EditGroceryItem from "./EditGroceryItem";

type IngredientCollection = {
  item?: string;
  recipeParts?: number;
  amountOz?: number;
  amountMl?: number;
  amount?: number;
  units?: string;
};

const ounces = 2; //of alcohol per serving
const mLperOunce = 29.5735; //according to Google

const GroceryList = () => {
  const stateCocktails = useAppSelector(
    (state: any) => state.groceries.cocktails
  );
  const stateWines = useAppSelector((state: any) => state.groceries.wines);
  const stateBeers = useAppSelector((state: any) => state.groceries.beers);

  let liquorCollection: IngredientCollection[] = [];
  let mixersCollection: IngredientCollection[] = [];
  let garnishCollection: IngredientCollection[] = [];
  //let extraIngredientsCollection: IngredientCollection[] = [];

  //build collections of liquor, mixers, and garnish and extraIngredients, so that we can use lodash to combine like items
  stateCocktails.length > 0 &&
    stateCocktails.map((cocktail: Cocktail) => {
      let ouncesPerPart = cocktail.partEqualsOz || ounces;
      if (cocktail.liquor && cocktail.liquorParts && cocktail.servings) {
        ouncesPerPart = cocktail.partEqualsOz || ounces / cocktail.liquorParts;
        liquorCollection.push({
          item: cocktail.liquor,
          recipeParts: cocktail.liquorParts,
          amountOz:
            Math.ceil(
              ouncesPerPart * cocktail.liquorParts * cocktail.servings * 100
            ) / 100, //multiply by a hundred, round up, then divide by a hundred to get only the one hundredths place after the decimal
          amountMl: Math.ceil(
            ouncesPerPart *
              cocktail.liquorParts *
              cocktail.servings *
              mLperOunce
          ),
        });
      }
      //console.log("liquorCollection", liquorCollection);
      if (
        cocktail.mixers &&
        cocktail.mixers.length > -1 &&
        cocktail.mixersPerServing &&
        cocktail.mixersPerServing.length > -1
      ) {
        cocktail.mixers.map((mixer, index) => {
          if (
            cocktail.servings &&
            cocktail.servings > 0 &&
            cocktail.mixersPerServing &&
            cocktail.mixersPerServing[index]
          ) {
            mixersCollection.push({
              item: mixer,
              recipeParts: cocktail.mixersPerServing[index],
              amountOz:
                Math.ceil(
                  ouncesPerPart *
                    cocktail.mixersPerServing[index] *
                    cocktail.servings *
                    100
                ) / 100, //multiply by a hundred, round up, then divide by a hundred to get only the one hundredths place after the decimal
              amountMl: Math.ceil(
                ouncesPerPart *
                  cocktail.mixersPerServing[index] *
                  cocktail.servings *
                  mLperOunce
              ),
            });
          }
        });
      }
      //console.log("mixersCollection", mixersCollection);

      if (
        cocktail.garnish &&
        cocktail.garnish.length > 0
        // && cocktail.garnishPerServing &&
        // cocktail.garnishPerServing.length > -1
      ) {
        cocktail.garnish.map((garnish, index) => {
          if (
            cocktail.servings &&
            cocktail.servings > 0 &&
            cocktail.garnishPerServing &&
            cocktail.garnishPerServing[index]
          ) {
            garnishCollection.push({
              item: garnish,
              recipeParts: cocktail.garnishPerServing[index],
              amount: Math.ceil(
                cocktail.garnishPerServing[index] * cocktail.servings
              ),
              units: cocktail.garnishUnits && cocktail.garnishUnits[index],
            });
          } else if (
            cocktail.servings &&
            cocktail.servings > 0 &&
            !cocktail.garnishPerServing
          ) {
            garnishCollection.push({
              item: garnish,
            });
          }
        });
      }
      if (
        cocktail.extraIngredients &&
        cocktail.extraIngredients.length > 0
        // && cocktail.extraIngredientsPerServing &&
        // cocktail.extraIngredientsPerServing.length > -1
      ) {
        cocktail.extraIngredients.map((extraIngredient, index) => {
          if (
            cocktail.servings &&
            cocktail.servings > 0 &&
            cocktail.extraIngredientsPerServing &&
            cocktail.extraIngredientsPerServing[index]
          ) {
            garnishCollection.push({
              item: extraIngredient,
              recipeParts: cocktail.extraIngredientsPerServing[index],
              amount: Math.ceil(
                cocktail.extraIngredientsPerServing[index] * cocktail.servings
              ),
              units:
                cocktail.extraIngredientsUnits &&
                cocktail.extraIngredientsUnits[index],
            });
          } else if (
            cocktail.servings &&
            cocktail.servings > 0 &&
            !cocktail.extraIngredientsPerServing
          ) {
            garnishCollection.push({
              item: extraIngredient,
            });
          }
        });
      }
      //console.log("garnishCollection", garnishCollection);
    });
  //lodash _.filter https://lodash.com/docs/4.17.15#filter or maybe https://lodash.com/docs/4.17.15#mergeWith the mixersCollection to combine identical mixers and add their values together

  let liquor:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null
    | undefined = [];
  let wine:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null
    | undefined = [];
  let beer:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null
    | undefined = [];
  let mixers:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null
    | undefined = [];
  let extraIngredients:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null[]
    | undefined[] = [];
  let garnish:
    | string[]
    | number[]
    | boolean[]
    | (JSX.Element | undefined)[]
    | null
    | undefined[] = [];

  const sumItems = (
    collection: IngredientCollection[],
    item: string,
    itemMultiples: string[],
    measureBy: string | undefined
  ) => {
    //let itemMultiples: (string | undefined)[] = [];
    if (itemMultiples.indexOf(item) > -1) {
      return;
    }

    let allThisItem: any[] = _.filter(collection, ["item", item]); //returns all the mixer objects of the same name, so that we can combine their values
    let amountOzThisItem = 0;
    let amountMlThisItem = 0;
    let amountThisItem = 0;

    if (allThisItem.length > 1) {
      itemMultiples.push(item);
    }

    allThisItem.length > 0 &&
      allThisItem.forEach((thisItemObj: IngredientCollection) => {
        //loops through the filtered array for this particular mixer and adds the values up
        if (thisItemObj && thisItemObj.amountOz) {
          amountOzThisItem += thisItemObj.amountOz;
        }
        if (thisItemObj && thisItemObj.amountMl) {
          amountMlThisItem += thisItemObj.amountMl;
        }
        if (thisItemObj && thisItemObj.amount) {
          if (
            thisItemObj.units?.indexOf("/") &&
            thisItemObj.units?.indexOf("/") > -1
          ) {
            //if units is a fraction
            const thisItemNumerator: number = parseInt(
              thisItemObj.units.split("/")[0]
            );
            const thisItemDenominator: number = parseInt(
              thisItemObj.units.split("/")[1]
            );
            const thisItemFraction: number =
              thisItemNumerator / thisItemDenominator;

            const numThisItem: number = thisItemObj.amount * thisItemFraction;

            // console.log(
            //   item + " " + thisItemFraction + "(" + thisItemObj.units + ")"
            // );
            amountThisItem += numThisItem;
          } else {
            amountThisItem += thisItemObj.amount;
          }
        }
      });
    //console.log('amountMlThisItem', amountMlThisItem);
    let response: number = 0;
    if (measureBy === "mL") {
      response = Math.ceil(amountMlThisItem);
    } else if (measureBy === "ounces" || measureBy === "oz") {
      response = Math.ceil(amountOzThisItem * 100) / 100;
    } else {
      response = Math.ceil(amountThisItem);
    }

    return response;
  };

  if (liquorCollection.length > 0) {
    let liquorMultiples: string[] = [];
    liquor = liquorCollection.map((liquorCalcd: IngredientCollection) => {
      if (liquorCalcd.item && liquorMultiples) {
        let amountOfThisItem = sumItems(
          liquorCollection,
          liquorCalcd.item,
          liquorMultiples,
          "mL"
        ) as number;

        if (amountOfThisItem) {
          const bottles = Math.ceil(amountOfThisItem / 750); //should give me the number of bottles

          return (
            <>
              <EditGroceryItem
                ingredient={liquorCalcd}
                collection={liquorCollection}
                item={liquorCalcd.item}
                itemMultiples={liquorMultiples}
                measureBy="mL"
                amountOfThisItem={amountOfThisItem}
              ></EditGroceryItem>

              {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                {bottles} {bottles === 1 ? "bottle" : "bottles"} (750mL) of{" "}
                {liquorCalcd.item}
              </Typography> */}
            </>
          );
        }
      }
    });
  }

  if (stateWines.length > 0) {
    wine = stateWines.map(
      (wine: {
        servings: number;
        name:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactFragment
          | React.ReactPortal
          | null
          | undefined;
      }) => {
        const bottles = Math.ceil(wine.servings / 5); //should give me the number of bottles, 5 servings per 750mL bottle
        return (
          <Typography component="li" sx={{ fontSize: ".5em" }}>
            {bottles} {bottles === 1 ? "bottle" : "bottles"} (750mL) of{" "}
            {wine.name}
          </Typography>
        );
      }
    );
  }
  if (stateBeers.length > 0) {
    beer = stateBeers.map(
      (beer: {
        servings: number;
        name:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactFragment
          | React.ReactPortal
          | null
          | undefined;
      }) => {
        return (
          <Typography component="li" sx={{ fontSize: ".5em" }}>
            {beer.servings} {beer.name}
          </Typography>
        );
      }
    );
  }

  if (mixersCollection.length > 0) {
    let mixerMultiples: string[] = [];
    mixers = mixersCollection.map((mixerCalcd: IngredientCollection) => {
      if (mixerCalcd.item && mixerMultiples) {
        let amountOfThisItem = sumItems(
          mixersCollection,
          mixerCalcd.item,
          mixerMultiples,
          "ounces"
        ) as number;

        if (amountOfThisItem) {
          return (
            <>
              <EditGroceryItem
                ingredient={mixerCalcd}
                collection={mixersCollection}
                item={mixerCalcd.item}
                itemMultiples={mixerMultiples}
                measureBy="oz"
                amountOfThisItem={amountOfThisItem}
              ></EditGroceryItem>

              {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                {amountOfThisItem}oz of {mixerCalcd.item}
              </Typography> */}
            </>
          );
        }
      }
    });
  }
  if (garnishCollection.length > 0) {
    let garnishMultiples: string[] = [];
    garnish = garnishCollection.map((garnishCalcd: IngredientCollection) => {
      if (garnishCalcd.item && garnishMultiples) {
        let amountOfThisItem = sumItems(
          garnishCollection,
          garnishCalcd.item,
          garnishMultiples,
          garnishCalcd.units
        ) as number;

        //console.log(garnishCalcd.item + " amountOfThisItem ", amountOfThisItem);

        if (amountOfThisItem) {
          if (
            garnishCalcd.units?.indexOf("/") &&
            garnishCalcd.units?.indexOf("/") > -1
          ) {
            //if units is a fraction
            //just using this to determine if this grocery item might be something that we only need one package of
            const thisItemNumerator: number = parseInt(
              garnishCalcd.units.split("/")[0]
            );
            const thisItemDenominator: number = parseInt(
              garnishCalcd.units.split("/")[1]
            );
            const thisItemFraction: number =
              thisItemNumerator / thisItemDenominator;
            if (thisItemFraction > 0.01) {
              return (
                <>
                  <EditGroceryItem
                    ingredient={garnishCalcd}
                    collection={garnishCollection}
                    item={garnishCalcd.item}
                    itemMultiples={garnishMultiples}
                    measureBy={garnishCalcd.units}
                    amountOfThisItem={amountOfThisItem}
                  ></EditGroceryItem>

                  {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                    {Math.ceil(amountOfThisItem)}{" "}
                    {amountOfThisItem > 1
                      ? pluralize(garnishCalcd.item)
                      : pluralize.singular(garnishCalcd.item)}
                  </Typography> */}
                </>
              );
            } else {
              return (
                <>
                  <EditGroceryItem
                    ingredient={garnishCalcd}
                    collection={garnishCollection}
                    item={garnishCalcd.item}
                    itemMultiples={garnishMultiples}
                    measureBy={garnishCalcd.units}
                    amountOfThisItem={amountOfThisItem}
                  ></EditGroceryItem>

                  {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                    {garnishCalcd.item}
                  </Typography> */}
                </>
              );
            }
          } else if (garnishCalcd.units) {
            return (
              <>
                <EditGroceryItem
                  ingredient={garnishCalcd}
                  collection={garnishCollection}
                  item={garnishCalcd.item}
                  itemMultiples={garnishMultiples}
                  measureBy={garnishCalcd.units}
                  amountOfThisItem={amountOfThisItem}
                ></EditGroceryItem>

                {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                  {amountOfThisItem}{" "}
                  {garnishCalcd.units && amountOfThisItem > 1
                    ? pluralize(garnishCalcd.units)
                    : pluralize.singular(garnishCalcd.units)}
                  {" of "}
                  {garnishCalcd.item}
                </Typography> */}
              </>
            );
          } else {
            return (
              <>
                <EditGroceryItem
                  ingredient={garnishCalcd}
                  collection={garnishCollection}
                  item={garnishCalcd.item}
                  itemMultiples={garnishMultiples}
                  measureBy={garnishCalcd.units}
                  amountOfThisItem={amountOfThisItem}
                ></EditGroceryItem>

                {/* <Typography component="li" sx={{ fontSize: ".5em" }}>
                  {amountOfThisItem}{" "}
                  {amountOfThisItem > 1
                    ? pluralize(garnishCalcd.item)
                    : pluralize.singular(garnishCalcd.item)}
                </Typography> */}
              </>
            );
          }
        } else {
          return (
            <>
              <EditGroceryItem
                ingredient={garnishCalcd}
                collection={garnishCollection}
                item={garnishCalcd.item}
                itemMultiples={garnishMultiples}
                measureBy={garnishCalcd.units}
                amountOfThisItem={amountOfThisItem}
              ></EditGroceryItem>

              <Typography component="li" sx={{ fontSize: ".5em" }}>
                {garnishCalcd.item}
              </Typography>
            </>
          );
        }
      }
    });
  }

  if (stateCocktails.length > 0 && stateCocktails[0].$id) {
    extraIngredients = stateCocktails.map((cocktail: any) => {
      if (
        cocktail.extraIngredients &&
        cocktail.extraIngredients.length > 0 &&
        cocktail.extraIngredients[0] != ""
      )
        return cocktail.extraIngredients.map((ingredient: string) => {
          if (ingredient) {
            return (
              <Typography component="li" sx={{ fontSize: ".5em" }}>
                enough {ingredient} for {cocktail.servings} servings
              </Typography>
            );
          }
        });
    });
    //garnish = stateCocktails.map((cocktail: any) => {
    // let garnishMultiples: string[] = [];
    // garnish = garnishCollection.map((garnishCalcd: IngredientCollection) => {
    // 	if (garnishCalcd.item && garnishMultiples) {
    // 		let amountOfThisItem = sumItems(
    // 			garnishCollection,
    // 			garnishCalcd.item,
    // 			garnishMultiples,
    // 			'mL'
    // 		) as number;

    // 		if (amountOfThisItem) {
    // 			const bottles = Math.ceil(amountOfThisItem / 750); //should give me the number of bottles

    // 			return (
    // 				<Typography component='li'>
    // 					{bottles} {bottles === 1 ? 'bottle' : 'bottles'} (750mL) of{' '}
    // 					{garnishCalcd.item}
    // 				</Typography>
    // 			);
    // 		}
    // 	}
    // });
    // if (cocktail.garnish && cocktail.garnish.length > 0)
    // 	return cocktail.garnish.map((thisGarnish: string) => {
    // 		if (thisGarnish) {
    // 			return (
    // 				<Typography component='li'>
    // 					enough {thisGarnish} for {cocktail.servings} servings
    // 				</Typography>
    // 			);
    // 		}
    // 	});
    //});
  }

  return (
    <>
      {((stateCocktails.length > 0 && stateCocktails[0].$id) ||
        (stateWines.length > 0 && stateWines[0].name)) && (
        <Grid
          item
          md={3}
          className="groceryList"
          sx={{ textAlign: "left", padding: "20px" }}
        >
          <Typography component="h3" sx={{ color: "var(--green)!important" }}>
            Grocery List:
          </Typography>
          {liquor && liquor.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Liquor
            </Typography>
          )}
          {liquor}
          {wine && wine.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Wine
            </Typography>
          )}
          {wine}
          {beer && beer.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Beer
            </Typography>
          )}
          {beer}
          {mixers && mixers.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Mixers
            </Typography>
          )}
          {mixers}
          {/* {extraIngredients && extraIngredients.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Extra Ingredients
            </Typography>
          )}
          {extraIngredients} */}
          {garnish && garnish.length > 0 && (
            <Typography
              component="h3"
              sx={{
                color: "var(--gray)!important",
                fontWeight: "400!important",
                fontFamily: "Bree Serif!important",
              }}
            >
              Other Items
            </Typography>
          )}
          {garnish}
        </Grid>
        // END .groceryList
      )}
    </>
  );
};

GroceryList.propTypes = {};

export default GroceryList;
