import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton, Dialog, DialogContent } from "@mui/material";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";
import ShoppingBasketTwoToneIcon from "@mui/icons-material/ShoppingBasketTwoTone";
import GroceryItemEditForm from "./GroceryItemEditForm";

import { GroceryItem } from "../types/GroceryItem";

type propsTypes = GroceryItem;

const EditGroceryItem = (groceryItem: propsTypes) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const dialogHandleClose = () => {
    setDialogOpen(false);
  };
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
          <GroceryItemEditForm dialogHandleClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
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
    </>
  );
};

EditGroceryItem.propTypes = {
  groceryItem: PropTypes.object.isRequired,
};

export default EditGroceryItem;
