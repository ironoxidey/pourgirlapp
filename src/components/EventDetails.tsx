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
  Avatar,
  Tooltip,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";

import TextFieldWrapper from "./common/TextField";

//import { addCocktail, updateCocktail } from "../reducers/groceriesSlice";
//import { setRightToMakeChanges } from "../reducers/appSlice";

import { setEventsList, setTheEvent } from "../reducers/eventListSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Event } from "../types/Event";
import { Calculate } from "@mui/icons-material";
import { fontStyle, fontWeight } from "@mui/system";

type FormState = {
  $id?: string;
  email?: string;
  name?: string;
  eventKind?: string;
  when?: string;
  where?: string;
  guestCount?: number;
  barHours?: string;
  barOpen?: string;
  barClose?: string;
  extraStuff?: string[];
  phone?: string;
  extraNotes?: string;
  whenString?: string;
};
const INITIAL_FORM_STATE: FormState = {
  $id: "",
  email: "",
  name: "",
  eventKind: "",
  when: "",
  where: "",
  guestCount: 0,
  barHours: "",
  barOpen: "",
  barClose: "",
  extraStuff: [],
  phone: "",
  extraNotes: "",
  whenString: "",
};

type propsTypes = {
  $id?: string;
  email?: string;
  name?: string;
  eventKind?: string;
  when?: string;
  where?: string;
  guestCount?: number;
  barHours?: string;
  barOpen?: string;
  barClose?: string;
  extraStuff?: string[];
  phone?: string;
  extraNotes?: string;
  whenString?: string;
};

const EventDetails = (props: propsTypes) => {
  // const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);

  const dispatch = useAppDispatch();

  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);

  const [events, setEvents] = useState<any[]>([]);
  const stateEvents = useAppSelector((state: any) => state.events.events);
  const stateTheEvent = useAppSelector((state: any) => state.events.theEvent);

  const handleOnChange = useDebouncedCallback((theEvent: Event) => {
    dispatch(setTheEvent(theEvent));
  }, 150);

  useEffect(() => {
    const typeformEvents = databases.listDocuments(
      "62e751ad5c4167bdba50", //database_id
      "6365068be90f6574ab0d", // collectionId - typeformEvents
      [Query.orderAsc("email")] // queries
    );

    typeformEvents.then(
      function (response: any) {
        // console.log(response); // Success
        dispatch(setEventsList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, [stateApp]);

  useEffect(() => {
    setEvents(stateEvents);
  }, [stateEvents]);

  return (
    <Formik
      initialValues={{
        ...INITIAL_FORM_STATE,
        $id: stateTheEvent.$id,
        email: stateTheEvent.email,
        name: stateTheEvent.name,
        eventKind: stateTheEvent.eventKind,
        when: stateTheEvent.when,
        where: stateTheEvent.where,
        guestCount: stateTheEvent.guestCount,
        barHours: stateTheEvent.barHours,
        barOpen: stateTheEvent.barOpen,
        barClose: stateTheEvent.barClose,
        extraStuff: stateTheEvent.extraStuff,
        phone: stateTheEvent.phone,
        extraNotes: stateTheEvent.extraNotes,
        whenString: stateTheEvent.whenString,
      }}
      // validationSchema={FORM_VALIDATION}
      onSubmit={(values) => {
        // onSubmit(values);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form style={{ width: "100%" }}>
          <>
            <Grid
              container
              sx={{
                justifyContent: "space-around",
                flexDirection: "row",
                margin: "20px auto",
              }}
              className="eventPicker"
            >
              <Grid item sx={{ width: "80%" }}>
                <Autocomplete
                  id={"eventSelect"}
                  disableClearable
                  blurOnSelect
                  // defaultValue={
                  //   props.cocktail &&
                  //   props.cocktail.$id &&
                  //   props.cocktail
                  // }
                  options={events}
                  getOptionLabel={(option: any) =>
                    option.$id +
                    " — " +
                    option.whenString +
                    " — " +
                    option.name +
                    " — " +
                    option.where +
                    " — " +
                    option.eventKind
                  }
                  onChange={(e: any, value: any) => {
                    handleOnChange(value);
                    console.log("autocomplete onChange", value);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Tooltip
                        arrow={true}
                        placement="bottom-start"
                        title={
                          <>
                            <div></div>
                          </>
                        }
                      >
                        <Grid container alignItems="center">
                          <Typography
                            sx={{
                              margin: "0 4px",
                            }}
                          >
                            {option.whenString} — {option.name} — {option.where}{" "}
                            — {option.eventKind}
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
                      label={`Event`}
                      name={"event"}
                      // onFocus={() => {
                      //   dispatch(setRightToMakeChanges("FORM"));
                      // }}
                    />
                  )}
                ></Autocomplete>
              </Grid>
            </Grid>
            {stateTheEvent && stateTheEvent.$id && (
              <>
                <Grid
                  container
                  sx={{
                    justifyContent: "space-around",
                    flexDirection: "column",
                    margin: "20px auto",
                    textAlign: "left",
                    maxWidth: "1024px",
                    width: "80%",
                  }}
                  className="eventDetails"
                >
                  {stateTheEvent.name && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Name:
                        </span>{" "}
                        {stateTheEvent.name}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.email && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Email:
                        </span>{" "}
                        {stateTheEvent.email}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.phone && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Phone:
                        </span>{" "}
                        {stateTheEvent.phone}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.eventKind && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Event Kind:
                        </span>{" "}
                        {stateTheEvent.eventKind}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.when && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          When:
                        </span>{" "}
                        {new Date(stateTheEvent.when).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.where && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Where:
                        </span>{" "}
                        {stateTheEvent.where}
                      </Typography>
                      <TextFieldWrapper
                        name="where"
                        placeholder="Where"
                        value={values.where || stateTheEvent.where || ""}
                        onChange={(value: number) =>
                          setFieldValue(
                            "where",
                            value !== null ? value : stateTheEvent.where
                          )
                        }
                      />
                    </Grid>
                  )}

                  {stateTheEvent.guestCount && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Guest Count:
                        </span>{" "}
                        {stateTheEvent.guestCount}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.barHours && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Bar Hours:
                        </span>{" "}
                        {stateTheEvent.barHours}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.extraStuff &&
                    stateTheEvent.extraStuff.length > 0 && (
                      <Grid item>
                        <Typography>
                          <span
                            className="keyHeading"
                            style={{ fontWeight: "bold" }}
                          >
                            Extra Stuff:
                          </span>{" "}
                          {stateTheEvent.extraStuff.join(", ")}
                        </Typography>
                      </Grid>
                    )}

                  {stateTheEvent.extraNotes && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Extra Notes:
                        </span>{" "}
                        {stateTheEvent.extraNotes}
                      </Typography>
                    </Grid>
                  )}

                  {stateTheEvent.$createdAt && (
                    <Grid item>
                      <Typography>
                        <span
                          className="keyHeading"
                          style={{ fontWeight: "bold" }}
                        >
                          Inquired On:
                        </span>{" "}
                        {new Date(stateTheEvent.$createdAt).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </>
        </Form>
      )}
    </Formik>
  );
};

// EventDetails.propTypes = {
//   theEvent: PropTypes.string,
// };

export default EventDetails;
