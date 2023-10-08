import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton, Dialog, DialogContent, Avatar, Grid } from "@mui/material";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";
import ShoppingBasketTwoToneIcon from "@mui/icons-material/ShoppingBasketTwoTone";
import GroceryItemEditForm from "./GroceryItemEditForm";
import pluralize from "pluralize";

import _ from "lodash";

import { useAppSelector } from "../reducers/hooks";

import { GroceryItem } from "../types/GroceryItem";
import { toTitleCase } from "./common/toTitleCase";
import { pullDomainFrom } from "./common/pullDomainFrom";

type IngredientCollection = {
  item?: string;
  recipeParts?: number;
  amountOz?: number;
  amountMl?: number;
  amount?: number;
  units?: string;
};

type propsTypes = {
  ingredient?: IngredientCollection;
  amountOfThisItem?: number;
  collection?: IngredientCollection[];
  item?: string;
  itemMultiples?: string[];
  measureBy?: string | undefined;
};

const EditGroceryItem = (props: propsTypes) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const stateGroceryItemsList = useAppSelector(
    (state: any) => state.groceries.items
  );

  console.log("props", props);
  const dialogHandleClose = () => {
    setDialogOpen(false);
  };

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

  const [initialValues, setInitialValues] = useState(false);
  const [computedGroceryItem, setComputedGroceryItem] = useState<string>();
  const [theMatchingGroceryItem, setTheMatchingGroceryItem] =
    useState<GroceryItem>();

  useEffect(() => {
    if (props && props.ingredient && props.ingredient.item) {
      setTheMatchingGroceryItem(
        _.find(stateGroceryItemsList, function (groceryItem) {
          return groceryItem.title === props?.ingredient?.item;
        })
      );
      console.log("theMatchingGroceryItem", theMatchingGroceryItem);

      let numContainers;
      if (
        theMatchingGroceryItem &&
        theMatchingGroceryItem.unit === "oz" &&
        theMatchingGroceryItem.unitsPerContainer &&
        props.collection &&
        props.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.item,
          props.itemMultiples,
          "oz"
        ) as number;

        numContainers = Math.ceil(
          amountOfThisItem / theMatchingGroceryItem.unitsPerContainer
        );
      }
      if (
        theMatchingGroceryItem &&
        theMatchingGroceryItem.unit === "mL" &&
        theMatchingGroceryItem.unitsPerContainer &&
        props.collection &&
        props.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.item,
          props.itemMultiples,
          "mL"
        ) as number;

        numContainers = Math.ceil(
          amountOfThisItem / theMatchingGroceryItem.unitsPerContainer
        );
      }

      if (
        theMatchingGroceryItem &&
        theMatchingGroceryItem.container &&
        numContainers
      ) {
        setComputedGroceryItem(
          `${numContainers} ${
            numContainers > 1
              ? pluralize(theMatchingGroceryItem.container)
              : pluralize.singular(theMatchingGroceryItem.container)
          } (${theMatchingGroceryItem.unitsPerContainer}${
            theMatchingGroceryItem.unit
          }/${pluralize.singular(theMatchingGroceryItem.container)}) of ${
            theMatchingGroceryItem.title
          }`
        );
      } else if (
        props?.measureBy === "mL" &&
        props.collection &&
        props.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.item,
          props.itemMultiples,
          "mL"
        ) as number;
        const bottles = Math.ceil(amountOfThisItem / 750); //should give me the number of bottles
        setComputedGroceryItem(
          `${bottles} ${
            amountOfThisItem && Math.ceil(amountOfThisItem / 750) > 1
              ? pluralize("bottle")
              : pluralize.singular("bottle")
          } (750mL/bottle) of ${props.ingredient.item}`
        );
      } else if (
        props?.measureBy === "oz" &&
        props.collection &&
        props.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.item,
          props.itemMultiples,
          "oz"
        ) as number;
        setComputedGroceryItem(
          `${amountOfThisItem}oz of ${props.ingredient.item}`
        );
      } else if (
        props?.ingredient?.units &&
        props?.ingredient?.units.indexOf("/") &&
        props?.ingredient?.units.indexOf("/") > -1
      ) {
        setComputedGroceryItem(
          `${props?.amountOfThisItem} ${
            props?.amountOfThisItem && props?.amountOfThisItem > 1
              ? pluralize(props.ingredient.item)
              : pluralize.singular(props.ingredient.item)
          }`
        );
      } else if (props?.ingredient?.units) {
        setComputedGroceryItem(
          `${props?.amountOfThisItem} ${
            props?.amountOfThisItem && props?.amountOfThisItem > 1
              ? pluralize(props?.ingredient?.units)
              : pluralize.singular(props?.ingredient?.units)
          } of ${props.ingredient.item}`
        );
      } else {
        setComputedGroceryItem(
          `${props?.amountOfThisItem} ${
            props?.amountOfThisItem && props?.amountOfThisItem > 1
              ? pluralize(props.ingredient.item)
              : pluralize.singular(props.ingredient.item)
          }`
        );
      }

      console.log("initial values", initialValues);
    }
  }, [props, props.ingredient, props.ingredient?.amountOz]);

  useEffect(() => {
    if (!theMatchingGroceryItem && props.item && props.measureBy) {
      setTheMatchingGroceryItem({
        title: props.item,
        unit: props.measureBy,
        whereToBuy: [""],
      });
      setInitialValues(true);
    }
  }, [
    props,
    props.ingredient,
    props.ingredient?.amountOz,
    theMatchingGroceryItem,
  ]);

  return (
    <>
      <Dialog
        // className="addEditCocktail"
        open={dialogOpen}
        onClose={dialogHandleClose}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
        scroll="body"
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <GroceryItemEditForm
            dialogHandleClose={() => setDialogOpen(false)}
            theGroceryItem={theMatchingGroceryItem}
          />
        </DialogContent>
      </Dialog>

      {computedGroceryItem ? (
        <>
          <Grid
            container
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            {theMatchingGroceryItem?.img && (
              <Grid
                item
                sx={{ cursor: "pointer" }}
                onClick={() => setDialogOpen(true)}
              >
                <img
                  src={theMatchingGroceryItem?.img}
                  style={{
                    width: "30px",
                    marginRight: "4px",
                    display: "inline",
                  }}
                ></img>
              </Grid>
            )}
            <Grid item>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setDialogOpen(true)}
              >
                {computedGroceryItem}
              </span>

              {theMatchingGroceryItem &&
                theMatchingGroceryItem.whereToBuy &&
                theMatchingGroceryItem.whereToBuy.length > -1 &&
                theMatchingGroceryItem.whereToBuy.map((whereToBuyURL) => {
                  if (whereToBuyURL !== undefined && whereToBuyURL !== "") {
                    const theURL = new URL(whereToBuyURL);
                    return (
                      <a
                        href={whereToBuyURL}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: "4px" }}
                        title={toTitleCase(pullDomainFrom(whereToBuyURL))}
                      >
                        <img
                          src={
                            "https://www.google.com/s2/favicons?domain=" +
                            theURL.hostname
                          }
                        />
                      </a>
                    );
                  }
                })}
              {props.amountOfThisItem && props.measureBy && (
                <span
                  style={{
                    display: "block",
                    fontSize: ".6em",
                    lineHeight: "1",
                  }}
                >
                  (Total: {props.amountOfThisItem + props.measureBy})
                </span>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <IconButton onClick={() => setDialogOpen(true)}>
          <ShoppingBasketTwoToneIcon
            sx={{
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#fff",
              verticalAlign: "middle",
            }}
          />
        </IconButton>
      )}
    </>
  );
};

EditGroceryItem.propTypes = {
  ingredient: PropTypes.object,
  amountOfThisItem: PropTypes.number,
};

export default EditGroceryItem;
