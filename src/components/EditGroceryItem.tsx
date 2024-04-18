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

  const [numContainers, setNumContainers] = useState(0);

  const stateGroceryItemsList = useAppSelector(
    (state: any) => state.groceries.items
  );
  const stateShowGroceryTotals = useAppSelector(
    (state: any) => state.app.showGroceryTotals
  );
  const stateShowGroceryPrices = useAppSelector(
    (state: any) => state.app.showGroceryPrices
  );

  // console.log("props", props);
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
    // if (itemMultiples.indexOf(item) > -1) {
    //   console.log("sumItems " + item + " has multiples");
    //   return;
    // }

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
    // console.log(props.item + " sumItems response", response);

    return response;
  };

  const [initialValues, setInitialValues] = useState(false);
  const [computedGroceryItem, setComputedGroceryItem] = useState<string>();
  const [theMatchingGroceryItem, setTheMatchingGroceryItem] =
    useState<GroceryItem>({
      title: props.item,
      unit: props.measureBy,
      whereToBuy: [""],
    });

  useEffect(() => {
    if (props && props.ingredient && props.ingredient.item) {
      setTheMatchingGroceryItem(
        _.find(stateGroceryItemsList, function (groceryItem) {
          return groceryItem.title === props?.ingredient?.item;
        })
      );
    }
  }, [
    props,
    props.ingredient,
    props.ingredient?.amountOz,
    props.ingredient?.item,
    props.amountOfThisItem,
    props.item,
  ]);

  // console.log("computedGroceryItem", computedGroceryItem);

  useEffect(() => {
    if (
      props &&
      props.ingredient &&
      props.ingredient.item &&
      theMatchingGroceryItem &&
      theMatchingGroceryItem.unitsPerContainer &&
      props.collection &&
      props.ingredient.item &&
      props.itemMultiples
    ) {
      if (theMatchingGroceryItem.unit === "oz") {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
          props.itemMultiples,
          "oz"
        ) as number;

        setNumContainers(
          Math.ceil(amountOfThisItem / theMatchingGroceryItem.unitsPerContainer)
        );
        console.log("theMatchingGroceryItem", theMatchingGroceryItem);
        console.log("amountOfThisItem", amountOfThisItem);
      }
      if (theMatchingGroceryItem.unit === "mL") {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
          props.itemMultiples,
          "mL"
        ) as number;

        setNumContainers(
          Math.ceil(amountOfThisItem / theMatchingGroceryItem.unitsPerContainer)
        );
        console.log("theMatchingGroceryItem", theMatchingGroceryItem);
        console.log("amountOfThisItem", amountOfThisItem);
      }
    }
  }, [
    props,
    props.ingredient,
    props.ingredient?.item,
    props.amountOfThisItem,
    theMatchingGroceryItem,
    props.collection,
    props.ingredient?.item,
    props.itemMultiples,
  ]);

  useEffect(() => {
    if (props && props.ingredient && props.ingredient.item) {
      // console.log(props.ingredient.item + " numContainers", numContainers);
      if (
        theMatchingGroceryItem &&
        theMatchingGroceryItem.container &&
        numContainers > 0
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
        theMatchingGroceryItem &&
        theMatchingGroceryItem.title &&
        props?.ingredient?.units &&
        props?.ingredient?.units.indexOf("/") &&
        props?.ingredient?.units.indexOf("/") > -1
      ) {
        //if units is a fraction
        //just using this to determine if this grocery item might be something that we only need one package of
        const thisItemNumerator: number = parseInt(
          props?.ingredient?.units.split("/")[0]
        );
        const thisItemDenominator: number = parseInt(
          props?.ingredient?.units.split("/")[1]
        );
        const thisItemFraction: number =
          thisItemNumerator / thisItemDenominator;
        if (thisItemFraction <= 0.01) {
          setComputedGroceryItem(`${theMatchingGroceryItem.title}`);
        } else {
          setComputedGroceryItem(`${
            props && props.amountOfThisItem && Math.ceil(props.amountOfThisItem)
          } 
                    ${
                      props &&
                      props.amountOfThisItem &&
                      props.amountOfThisItem > 1
                        ? pluralize(props.ingredient.item)
                        : pluralize.singular(props.ingredient.item)
                    }`);
        }
      } else if (
        theMatchingGroceryItem?.unit === "oz" &&
        !theMatchingGroceryItem.unitsPerContainer &&
        props.collection &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
          props.itemMultiples,
          "oz"
        ) as number;
        // console.log(
        //   "amountOfThisItem (" + props.ingredient.item + ")",
        //   amountOfThisItem
        // );
        if (amountOfThisItem > 0) {
          setComputedGroceryItem(
            `${amountOfThisItem}oz of ${props.ingredient.item}`
          );
        } else {
          setComputedGroceryItem(`${props.ingredient.item}`);
        }
      } else if (
        theMatchingGroceryItem?.unit === "mL" &&
        !theMatchingGroceryItem.unitsPerContainer &&
        props.collection &&
        props.ingredient.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
          props.itemMultiples,
          "mL"
        ) as number;
        // console.log(
        //   "amountOfThisItem (" + props.ingredient.item + ")",
        //   amountOfThisItem
        // );
        // if (amountOfThisItem > 0) {
        //   setComputedGroceryItem(
        //     `${amountOfThisItem}mL of ${props.ingredient.item}`
        //   );
        // } else {
        //   setComputedGroceryItem(`${props.ingredient.item}`);
        // }

        const bottles = Math.ceil(amountOfThisItem / 750); //should give me the number of bottles
        setComputedGroceryItem(
          `${bottles} ${
            amountOfThisItem && Math.ceil(amountOfThisItem / 750) > 1
              ? pluralize("bottle")
              : pluralize.singular("bottle")
          } (750mL/bottle) of ${props.ingredient.item}`
        );
      } else if (
        props?.measureBy === "mL" &&
        props.collection &&
        props.ingredient.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
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
        props.ingredient.item &&
        props.itemMultiples
      ) {
        let amountOfThisItem = sumItems(
          props.collection,
          props.ingredient.item,
          props.itemMultiples,
          "oz"
        ) as number;
        // console.log(
        //   "amountOfThisItem (" + props.ingredient.item + ")",
        //   amountOfThisItem
        // );
        if (amountOfThisItem > 0) {
          setComputedGroceryItem(
            `${amountOfThisItem}oz of ${props.ingredient.item}`
          );
        } else {
          setComputedGroceryItem(`${props.ingredient.item}`);
        }
      } else if (
        props?.ingredient?.units &&
        props?.ingredient?.units.indexOf("/") &&
        props?.ingredient?.units.indexOf("/") > -1
      ) {
        //if units is a fraction
        //just using this to determine if this grocery item might be something that we only need one package of
        const thisItemNumerator: number = parseInt(
          props?.ingredient?.units.split("/")[0]
        );
        const thisItemDenominator: number = parseInt(
          props?.ingredient?.units.split("/")[1]
        );
        const thisItemFraction: number =
          thisItemNumerator / thisItemDenominator;
        if (thisItemFraction > 0.01) {
          setComputedGroceryItem(
            `${props?.amountOfThisItem} ${
              props?.amountOfThisItem && props?.amountOfThisItem > 1
                ? pluralize(props.ingredient.item)
                : pluralize.singular(props.ingredient.item)
            }`
          );
        } else {
          setComputedGroceryItem(`${props.ingredient.item}`);
        }
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

      // console.log("initial values", initialValues);
    }
  }, [
    props,
    props.ingredient,
    props.ingredient?.amountOz,
    props.ingredient?.item,
    props.item,
    props.collection,
    props.itemMultiples,
    theMatchingGroceryItem,
    numContainers,
  ]);

  useEffect(() => {
    // console.log("theMatchingGroceryItem", theMatchingGroceryItem);
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
    props.amountOfThisItem,
    theMatchingGroceryItem,
    theMatchingGroceryItem?.$id,
    theMatchingGroceryItem?.title,
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
          <p
            // container
            className="groceryItem"
            style={{
              display: "block",
              // flexDirection: "row",
              // flexWrap: "nowrap",
              alignItems: "center",
              marginTop: "5px",
              marginBottom: "5px",
              marginLeft: "10px",
              clear: "both",
              width: "auto",
            }}
          >
            {theMatchingGroceryItem?.img && (
              // <Grid
              //   item
              //   sx={{
              //     cursor: "zoom-in",
              //     transition: ".2s all ease-in-out",
              //      "&:hover": {
              //        transform: "scale(5,5)",
              //      },
              //   }}
              // >
              <img
                src={theMatchingGroceryItem?.img}
                style={{
                  width: "30px",
                  marginRight: "4px",
                  display: "inline",
                  float: "left",
                }}
                onClick={() => setDialogOpen(true)}
              ></img>
              // </Grid>
            )}

            {/* <Grid item sx={{ lineHeight: "1.2" }}> */}
            <span
              className="groceryItemText"
              style={{
                // cursor: "pointer",
                margin: "0",
                lineHeight: "1.2",
              }}
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

            {stateShowGroceryPrices &&
              theMatchingGroceryItem &&
              theMatchingGroceryItem.avgPrice &&
              numContainers && (
                <span
                  className="totalAmount"
                  style={{
                    display: "block",
                    fontSize: ".6em",
                    lineHeight: "1",
                  }}
                >
                  $
                  {(
                    Math.round(
                      (theMatchingGroceryItem.avgPrice * numContainers || 0) *
                        100
                    ) / 100
                  ).toFixed(2)}
                </span>
              )}

            {stateShowGroceryTotals &&
              props.amountOfThisItem &&
              props.amountOfThisItem > 0 &&
              props.measureBy &&
              (props.measureBy === "mL" ||
                props.measureBy === "ounces" ||
                props.measureBy === "oz") && (
                <span
                  className="totalAmount"
                  style={{
                    display: "block",
                    fontSize: ".6em",
                    lineHeight: "1",
                  }}
                >
                  (Total: {props.amountOfThisItem + props.measureBy})
                </span>
              )}
            {/* </Grid> */}
          </p>
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
