import React from "react";
import PropTypes from "prop-types";
import { Bartender } from "../types/Bartender";
import { Grid, Tooltip } from "@mui/material";

type propsTypes = {
  bartender: Bartender;
  busyThatDay: any;
};

const BartenderDisplay = (props: propsTypes) => {
  return (
    <>
      <Tooltip
        arrow={true}
        placement="bottom"
        title={
          <>
            <Grid item sx={{ textAlign: "center", flexDirection: "column" }}>
              {props.bartender.firstName} {props.bartender.lastName}
              <div>({props.bartender.location})</div>
              <div>{props.bartender.email}</div>
              <div>{props.bartender.phone}</div>
              <div>{props.bartender.capabilities?.join(", ")}</div>
            </Grid>
          </>
        }
      >
        <Grid
          item
          sx={{
            border: "1px solid var(--orange)",
            borderRadius: "100px",
            backgroundColor: "var(--orange)",
            margin: "4px",
            padding: "4px 12px",
            color: "#ffffff",
            fontWeight: "700",
            opacity: props.busyThatDay.length > 0 ? ".4" : "1",
          }}
        >
          {props.bartender.firstName}
        </Grid>
      </Tooltip>
    </>
  );
};

BartenderDisplay.propTypes = {
  bartender: PropTypes.object,
  busyThatDay: PropTypes.array,
};

export default BartenderDisplay;
