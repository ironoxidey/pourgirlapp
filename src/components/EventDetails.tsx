import React, { useEffect, useState, FormEvent } from "react";
// import PropTypes from "prop-types";
import { account, databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { Formik, Form, useFormikContext } from "formik";
import _ from "lodash";
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

// import { gapi } from "gapi-script"; //Google Api for Calendar

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";

import TextFieldWrapper from "./common/TextField";

//import { addCocktail, updateCocktail } from "../reducers/groceriesSlice";
//import { setRightToMakeChanges } from "../reducers/appSlice";

import {
  setEventsList,
  setBartendersList,
  setServicePackagesList,
  setGoogleCalEventsList,
  setTheEvent,
} from "../reducers/eventListSlice";

import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { useDebouncedCallback } from "use-debounce";
import { Event } from "../types/Event";
import { ServicePackage } from "../types/ServicePackage";
import { GoogleCalEvent } from "../types/GoogleCalEvent";
import { Calculate } from "@mui/icons-material";
import { fontStyle, fontWeight } from "@mui/system";
import { Bartender } from "../types/Bartender";
import BartenderDisplay from "./BartenderDisplay";

import DraftQuote from "./DraftQuote";

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

  barOpensAt?: string;
  barClosesAt?: string;
  numBarHours?: number;
  packageTitle?: string;
  packagePrice?: number;
  initialPackagePrice?: number;
  numBartenders?: number;
  numBarbacks?: number;
  numSetupHours?: number;
  numCleanupHours?: number;
  arriveAt?: string;
  leaveAt?: string;
  guestRange?: string;
  numTotalHours?: number;
  basePackage?: ServicePackage;
  basePrice?: number;
  difFactoring?: number;
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

  barOpensAt: "",
  barClosesAt: "",
  numBarHours: 0,
  packageTitle: "",
  packagePrice: 0,
  initialPackagePrice: 0,
  numBartenders: 1,
  numBarbacks: 0,
  numSetupHours: 2,
  numCleanupHours: 0.5,
  arriveAt: "",
  leaveAt: "",
  guestRange: "",
  numTotalHours: 0,
  difFactoring: 0,
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
  const dispatch = useAppDispatch();

  //Google Calendar Stuff -- from https://fusebit.io/blog/google-calendar-react/
  //https://developers.google.com/calendar/api/v3/reference/events/get?apix=true
  //mostly from https://developers.google.com/calendar/api/quickstart/js - November 22, 2022
  // @ts-ignore: Property 'gapi' does not exist on type 'Window & typeof globalThis'.
  var gapi = window.gapi;

  const [gCalEvents, setGCalEvents] = useState<GoogleCalEvent[]>([]);
  const calendarID: string = import.meta.env.VITE_REACT_APP_GOOGLE_CALENDAR_ID;
  const apiKey: string = import.meta.env.VITE_REACT_APP_GOOGLE_CALENDER_API_KEY;
  const clientID: string = import.meta.env
    .VITE_REACT_APP_GOOGLE_CALENDER_CLIENT_ID;
  const accessToken: string = import.meta.env
    .VITE_REACT_APP_GOOGLE_CALENDER_ACCESS_TOKEN;
  const scopes = "https://www.googleapis.com/auth/calendar.readonly";
  var DISCOVERY_DOC = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  let tokenClient: any;
  let gapiInited = false;
  let gisInited = false;

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: DISCOVERY_DOC,
    });
    gapiInited = true;
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err: any) {
      console.log(err.message);
      return;
    }

    const events: GoogleCalEvent[] = response.result.items;
    if (!events || events.length == 0) {
      console.log("No events found.");
      return;
    }
    // Flatten to string to display
    // const output = events.reduce(
    //   (str: string, event: any) =>
    //     `${str}${event.summary} (${
    //       event.start.dateTime || event.start.date
    //     })\n`,
    //   "Events:\n"
    // );
    dispatch(setGoogleCalEventsList(events));
    //console.log(output);
    // return events;
  }

  function gisLoaded() {
    //@ts-ignore: Cannot find name 'google'.
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientID,
      scope: scopes,
      callback: "", // defined later
    });
    gisInited = true;

    tokenClient.callback = async (resp: { error: undefined }) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    };
  }

  const googleLoginWindow = (calendarID: string, apiKey: string) => {
    /**
     * Callback after Google Identity Services are loaded.
     */

    if (gapi.client && gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  useEffect(() => {
    gapiLoaded(); //inside the useEffect makes sure https://apis.google.com/js/api.js is loaded from index.html
    gisLoaded(); // inside the useEffect makes sure https://accounts.google.com/gsi/client is loaded from index.html
    googleLoginWindow(calendarID, apiKey);
  }, []);
  const stateGoogleCalEvents = useAppSelector(
    (state: any) => state.events.googleCalEvents
  );
  //END Google Calendar Stuff -- mostly

  // const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);

  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);

  const [events, setEvents] = useState<any[]>([]);
  const [allEventsThatDay, setAllEventsThatDay] = useState<GoogleCalEvent[]>(
    []
  );
  const stateEvents = useAppSelector((state: any) => state.events.events);
  const stateTheEvent = useAppSelector((state: any) => state.events.theEvent);

  const [numBarHours, setNumBarHours] = useState<number>();
  const [barOpensAt, setBarOpensAt] = useState<number>();
  // const [barClosesAt, setBarClosesAt] = useState<number>();

  const handleOnChange = useDebouncedCallback((theEvent: Event) => {
    dispatch(setTheEvent(theEvent));
  }, 150);

  useEffect(() => {
    const typeformEvents = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_TYPEFORM_EVENTS_COLLECTION_ID, // collectionId - typeformEvents
      [Query.orderDesc("$createdAt"), Query.limit(100)] // queries
    );

    typeformEvents.then(
      function (response: any) {
        //console.log("typeformEvents: ", response.documents); // Success
        dispatch(setEventsList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, [stateApp]);

  const stateBartenders = useAppSelector(
    (state: any) => state.events.bartenders
  );

  useEffect(() => {
    const bartenders = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_BARTENDERS_COLLECTION_ID, // collectionId - bartenders
      [Query.orderAsc("firstName")] // queries
    );

    bartenders.then(
      function (response: any) {
        // console.log(response); // Success
        dispatch(setBartendersList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, []);

  const stateServicePackages = useAppSelector(
    (state: any) => state.events.servicePackages
  );

  useEffect(() => {
    const servicePackages = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_SERVICEPACKAGES_COLLECTION_ID // collectionId - servicePackages
      // [Query.orderAsc("firstName")] // queries
    );

    servicePackages.then(
      function (response: any) {
        // console.log(response); // Success
        dispatch(setServicePackagesList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, []);

  let barOpenAt: number;
  let barCloseAt: number;

  useEffect(() => {
    setEvents(stateEvents);
  }, [stateEvents]);

  useEffect(() => {
    if (stateTheEvent.when) {
      const theEventDate = new Date(stateTheEvent.when).toLocaleString(
        "en-US",
        {
          timeZone: "UTC",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
      //console.log("theEventDate", theEventDate);
      setAllEventsThatDay(
        _.filter(stateGoogleCalEvents, (gCalEvent) => {
          if (gCalEvent.start.date) {
            //when a Google Calendar event is marked as "all-day" it doesn't get a dateTime in its "start" key, and so encoding the date with the UTC timeZone keeps it from reading as the day before
            const gCalEventDate = new Date(gCalEvent.start.date).toLocaleString(
              "en-US",
              {
                timeZone: "UTC",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
            //console.log("gCalEventDate", gCalEventDate);
            return gCalEventDate === theEventDate;
          } else if (gCalEvent.start.dateTime) {
            const gCalEventDate = new Date(
              gCalEvent.start.dateTime
            ).toLocaleString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            //console.log("gCalEventDate", gCalEventDate);
            return gCalEventDate === theEventDate;
          } else {
            return false;
          }
        })
      );
    }
  }, [stateTheEvent]);

  // const [packageTitle, setPackageTitle] = useState<string>();

  const QuoteProcessor = () => {
    //concept from https://codesandbox.io/s/formik-v2-useformikcontext-2qjrl
    const { values, setFieldValue } = useFormikContext();
    const formikValues: FormState = values || {};

    useEffect(() => {
      if (stateTheEvent.barHours) {
        //pulls all the numbers from stateTheEvent.barHours into an array
        const barHoursNumbers: number[] =
          stateTheEvent.barHours.match(/^\d+|\d+\b|\d+(?=\w)/g);
        //console.log("EventDetails barHoursNumbers", barHoursNumbers);
        if (barHoursNumbers) {
          //pulls the first number [0] from stateTheEvent.barHours
          barOpenAt =
            barHoursNumbers[0].toString().length < 3 //where people put in 330 to 730
              ? Number(barHoursNumbers[0])
              : Number(barHoursNumbers[0].toString().slice(0, -2)) +
                Number(barHoursNumbers[0].toString().slice(-2)) / 60;

          if (
            barHoursNumbers[1].toString().length === 2 &&
            barHoursNumbers[1] > 12
          ) {
            //if the second number looks like minutes (double digits greater than 12)
            barOpenAt += Number(barHoursNumbers[1]) / 60;
          }

          //pulls the second number [1] from stateTheEvent.barHours IF it's greater than 0 and less than 13, because sometimes someone enters 4:00 - 6:00 and the match regex considers the 00 the second number
          barCloseAt =
            barHoursNumbers[1] > 0 &&
            barHoursNumbers[1] < 13 &&
            barHoursNumbers[1].toString().length < 3
              ? Number(barHoursNumbers[1])
              : barHoursNumbers[1] > 0 &&
                barHoursNumbers[1].toString().length >= 3 //where people put in 330 to 730
              ? Number(barHoursNumbers[1].toString().slice(0, -2)) +
                Number(barHoursNumbers[1].toString().slice(-2)) / 60
              : barHoursNumbers[barHoursNumbers.length - 1] > 0 &&
                barHoursNumbers[barHoursNumbers.length - 1] < 13 &&
                barHoursNumbers[barHoursNumbers.length - 1].toString().length <
                  3
              ? Number(barHoursNumbers[barHoursNumbers.length - 1])
              : barHoursNumbers[barHoursNumbers.length - 1] > 0 &&
                barHoursNumbers[barHoursNumbers.length - 1].toString().length >=
                  3 //where people put in 330 to 730
              ? Number(
                  barHoursNumbers[barHoursNumbers.length - 1]
                    .toString()
                    .slice(0, -2)
                ) +
                Number(
                  barHoursNumbers[barHoursNumbers.length - 1]
                    .toString()
                    .slice(-2)
                ) /
                  60
              : Number(barHoursNumbers[2]);

          if (
            barHoursNumbers[barHoursNumbers.length - 1].toString().length ===
              2 &&
            barHoursNumbers[barHoursNumbers.length - 1] > 12
          ) {
            //if the last number looks like minutes (double digits greater than 12)
            barCloseAt +=
              Number(barHoursNumbers[barHoursNumbers.length - 1]) / 60;
          }

          if (Number(barOpenAt) > Number(barCloseAt)) {
            //if it's like 11am to 2pm
            let barHoursAmount: number = 0;
            barHoursAmount += 12 - Number(barOpenAt);
            barHoursAmount += Number(barCloseAt);
            setNumBarHours(barHoursAmount);
            console.log("barHoursAmount", barHoursAmount);
          } else {
            setNumBarHours(Number(barCloseAt) - Number(barOpenAt));
          }
        } else {
          setNumBarHours(-1);
        }
      }
      setBarOpensAt(barOpenAt);
      setFieldValue("barOpensAt", barOpenAt);
      // setBarClosesAt(barCloseAt);
      setFieldValue("barClosesAt", barCloseAt);
    }, [stateTheEvent]);

    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    const guestCountBetween = (packageGuestRange: string) => {
      const packageMin = Number(packageGuestRange?.split("-")[0]);
      const packageMax = Number(packageGuestRange?.split("-")[1]);
      const isBetween =
        packageMin &&
        packageMax &&
        stateTheEvent.guestCount >= packageMin &&
        stateTheEvent.guestCount <= packageMax;

      return isBetween;
    };

    //AutoDraft Quote Setup
    useEffect(() => {
      if (
        barOpensAt &&
        formikValues.barClosesAt &&
        numBarHours &&
        initialLoad
      ) {
        setFieldValue("numBarHours", numBarHours);

        if (stateTheEvent.guestCount && stateServicePackages) {
          const theServicePackage = stateServicePackages.filter(
            (servPack: ServicePackage) => {
              const weddingWords =
                /\b(wedding|marriage|matrimony|married|nuptials|union|ceremony|reception|bride|groom|vows|betrothal|espousal)\b/gi;
              const isWedding =
                stateTheEvent.eventKind.match(weddingWords)?.length > 0;
              console.log("isWedding", isWedding);
              if (
                isWedding &&
                servPack.packageTitle === "All-Inclusive" &&
                servPack.guestRange
              ) {
                return guestCountBetween(servPack.guestRange); //if stateTheEvent.guestCount is in the package's guest range return true
              } else if (
                !isWedding &&
                servPack.packageTitle !== "All-Inclusive"
              ) {
                if (servPack.guestRange && servPack.guestRange !== "up to 50") {
                  //if we've got a service pack guestRange and it's not "up to 50"
                  return guestCountBetween(servPack.guestRange); //if stateTheEvent.guestCount is in the package's guest range return true
                } else if (
                  servPack.guestRange === "up to 50" &&
                  stateTheEvent.guestCount <= 50
                ) {
                  //if the service pack is "up to 50", and the event's guest count is less than or equal to 50, we have a match!
                  if (
                    stateTheEvent.extraStuff?.includes(
                      "Mini Bar (4'x5' portable bar)"
                    ) &&
                    servPack.includesExtraStuff?.includes(
                      "Mini Bar (4'x5' portable bar)"
                    )
                  ) {
                    return true;
                  } else if (
                    !stateTheEvent.extraStuff.includes(
                      "Mini Bar (4'x5' portable bar)"
                    ) &&
                    !servPack.includesExtraStuff?.includes(
                      "Mini Bar (4'x5' portable bar)"
                    )
                  ) {
                    return true;
                  }

                  // const includedPackageExtras =
                  //   servPack.includesExtraStuff?.filter((inclExtra) => {
                  //     return stateTheEvent.extraStuff?.includes(inclExtra);
                  //   });
                  // console.log("includedPackageExtras", includedPackageExtras);
                  // if (
                  //   includedPackageExtras &&
                  //   includedPackageExtras.length > 0
                  // ) {
                  //   // const includedPackageExtras =
                  //   //   servPack.includesExtraStuff.filter((inclExtra) => {
                  //   //     return stateTheEvent.extraStuff?.includes(inclExtra);
                  //   //   });
                  //   return true; //return true if there are extraStuff the client asked for (in stateTheEvent.extraStuff) that are included in the package (mostly to get the Pretty Penny Plus )
                  // } else {
                  //   return true;
                  // }
                }
              }
            }
          );
          console.log("theServicePackage", theServicePackage);
          setFieldValue(
            "basePackage",
            theServicePackage[theServicePackage.length - 1]
          );
        } //if (props.guestCount)
      }
      setInitialLoad(false);
    }, [barOpensAt, formikValues.barClosesAt, numBarHours]);
    //END AutoDraft Quote Setup

    //if basePackage changes, update all its things
    useEffect(() => {
      if (formikValues.basePackage && formikValues.basePackage.packagePrice) {
        setFieldValue(
          "packageTitle",
          formikValues.basePackage.packageTitle != "All-Inclusive"
            ? formikValues.basePackage.packageTitle
            : stateTheEvent.where
        );
        setFieldValue("basePrice", formikValues.basePackage.packagePrice);
        setFieldValue("packagePrice", formikValues.basePackage.packagePrice);

        setFieldValue("numBartenders", formikValues.basePackage.numBartenders);
        setFieldValue("numBarbacks", formikValues.basePackage.numBarbacks);
        setFieldValue("numSetupHours", formikValues.basePackage.numSetupHours);

        setFieldValue(
          "numCleanupHours",
          formikValues.basePackage.numCleanupHours
        );
        setFieldValue("guestRange", formikValues.basePackage.guestRange);
      }
    }, [formikValues.basePackage]);

    //recalculate packagePrice
    useEffect(() => {
      if (formikValues.basePackage && formikValues.basePrice) {
        let calcPrice = formikValues.basePrice || 0;
        let calcSetupHours = formikValues.numSetupHours || 0;
        let calcCleanupHours = formikValues.numCleanupHours || 0;
        if (
          stateTheEvent.extraStuff &&
          stateTheEvent.extraStuff.indexOf("ice") > -1
        ) {
          calcPrice += stateTheEvent.guestCount * 2; //$2 per 2 pounds of ice per person
          console.log("plus ice - calcPrice: ", calcPrice);
        }

        const plusMinusSetupHours =
          Number(formikValues.numSetupHours) -
          Number(formikValues.basePackage.numSetupHours);
        const plusMinusCleanupHours =
          Number(formikValues.numCleanupHours) -
          Number(formikValues.basePackage.numCleanupHours);

        let plusMinusHours =
          Number(numBarHours) -
          Number(formikValues.basePackage.hoursBarService || 0) +
          plusMinusSetupHours +
          plusMinusCleanupHours;
        console.log("numBarHours", numBarHours);
        console.log(
          "formikValues.basePackage.hoursBarService",
          formikValues.basePackage.hoursBarService
        );
        console.log("plusMinusHours", plusMinusHours);
        console.log("formikValues.basePackage", formikValues.basePackage);

        const difFactoring =
          plusMinusHours *
          75 *
          ((formikValues.basePackage.numBartenders || 0) + //formikValues aren't getting updated fast enough
            (formikValues.basePackage.numBarbacks || 0));

        console.log("difFactoring", difFactoring);

        setFieldValue("difFactoring", difFactoring);

        calcPrice += difFactoring;

        console.log("calcPrice after difFactoring", calcPrice);

        const arrivalTime = barOpensAt && Number(barOpensAt) - calcSetupHours;
        const departureTime =
          formikValues.barClosesAt &&
          Number(formikValues.barClosesAt) + calcCleanupHours;

        const arriveAtTime = () => {
          if (arrivalTime && arrivalTime >= 1) {
            const hours = Number(arrivalTime.toString().split(".")[0]);
            const minutes =
              (Number(arrivalTime.toString().split(".")[1]) / 10) * 60;
            const amPM = hours > 9 ? "am" : "pm";
            return hours + ":" + (minutes || "00") + amPM;
          } else if ((arrivalTime && arrivalTime < 1) || arrivalTime === 0) {
            const hours = 12 + Number(arrivalTime.toString().split(".")[0]);
            const minutes =
              (Number(arrivalTime.toString().split(".")[1]) / 10) * 60;
            const amPM = hours > 9 && hours != 12 ? "am" : "pm";
            return hours + ":" + (minutes || "00") + amPM;
          } else {
            return;
          }
        };

        const leaveAtTime = () => {
          if (departureTime) {
            const hours = Number(departureTime.toString().split(".")[0]);
            const minutes =
              (Number(departureTime.toString().split(".")[1]) / 10) * 60;
            const amPM = hours === 12 ? "am" : "pm";
            return hours + ":" + (minutes || "00") + amPM;
          } else {
            return;
          }
        };

        setFieldValue("arriveAt", arriveAtTime());
        setFieldValue("leaveAt", leaveAtTime());
        setFieldValue("packagePrice", calcPrice);
        if (formikValues.numSetupHours && formikValues.numCleanupHours) {
          setFieldValue(
            "numTotalHours",
            numBarHours &&
              numBarHours +
                formikValues.numSetupHours +
                formikValues.numCleanupHours
          );
        }
      }
    }, [
      formikValues.numBartenders,
      formikValues.numBarbacks,
      formikValues.basePackage?.numSetupHours,
      formikValues.basePackage?.numCleanupHours,
      formikValues.numSetupHours,
      formikValues.numCleanupHours,
      formikValues.basePrice,
    ]);

    return null;
  };

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

        barOpensAt: "",
        barClosesAt: "",
        numBarHours: 0,
        packageTitle: "",
        packagePrice: 0,
        numBartenders: 1,
        numBarbacks: 0,
        numSetupHours: 2,
        numCleanupHours: 0.5,
        arriveAt: "",
        leaveAt: "",
        guestRange: "",
        numTotalHours: 0,
      }}
      // validationSchema={FORM_VALIDATION}
      onSubmit={(values) => {
        // onSubmit(values);
      }}
    >
      {({ setFieldValue, values, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <>
            <QuoteProcessor />
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
                    resetForm(value);
                    console.log("autocomplete onChange", value);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {/* <Tooltip
                        arrow={true}
                        placement="bottom-start"
                        title={
                          <>
                            <div></div>
                          </>
                        }
                      > */}
                      <Grid container alignItems="center">
                        <Typography
                          sx={{
                            margin: "0 4px",
                          }}
                        >
                          {option.whenString} — {option.name} — {option.where} —{" "}
                          {option.eventKind}
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
                    justifyContent: "center",
                    flexDirection: "row",
                    margin: "20px auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  className="eventDetailsWrapper"
                >
                  <Grid
                    item
                    container
                    sx={{
                      justifyContent: "start",
                      flexDirection: "column",
                      margin: "20px",
                      textAlign: "left",
                      maxWidth: "450px",
                      // width: "40%",
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
                      <>
                        <Grid item>
                          <Typography>
                            <span
                              className="keyHeading"
                              style={{ fontWeight: "bold" }}
                            >
                              When:
                            </span>{" "}
                            {new Date(stateTheEvent.when).toLocaleDateString(
                              "en-US",
                              {
                                timeZone: "UTC",
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                        </Grid>
                        {allEventsThatDay.length === 1 &&
                          ` (There is ${allEventsThatDay.length} other event this day)`}
                        {allEventsThatDay.length > 1 &&
                          ` (There are ${allEventsThatDay.length} other events this day)`}
                        {allEventsThatDay.length > 0 && (
                          <Grid
                            container
                            className="allEventsThatDay"
                            sx={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #dddddd",
                              borderRadius: "4px",
                              padding: "4px",
                            }}
                          >
                            <Grid
                              container
                              className="googleCalEvents"
                              sx={{
                                backgroundColor: "#eaeaea",
                                border: "1px solid #dddddd",
                                borderRadius: "4px",
                                padding: "4px",
                              }}
                            >
                              {allEventsThatDay.map(
                                (
                                  googleCalEvent: GoogleCalEvent,
                                  index: number
                                ) => {
                                  return (
                                    <Grid
                                      item
                                      key={index}
                                      sx={{
                                        backgroundColor: "#faf6f6",
                                        border: "solid 1px var(--teal)",
                                        borderBottomWidth: "4px",
                                        borderRadius: "8px",
                                        padding: "4px 12px",
                                        margin: "4px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                      className="googleCalEvent"
                                    >
                                      <a
                                        href={googleCalEvent.htmlLink}
                                        target="_blank"
                                      >
                                        {googleCalEvent.summary}
                                      </a>
                                    </Grid>
                                  );
                                }
                                //END allEventsThatDay.map
                              )}
                            </Grid>
                            <Grid container>
                              <Grid
                                item
                                sx={{
                                  margin: "4px",
                                  padding: "4px 0",
                                }}
                              >
                                Bartenders:
                              </Grid>
                              {stateBartenders &&
                                stateBartenders.map(
                                  (bartender: Bartender, index: number) => {
                                    let busyThatDay = _.filter(
                                      allEventsThatDay,
                                      {
                                        attendees: [{ email: bartender.email }],
                                      }
                                    );
                                    //console.log("busyThatDay", busyThatDay);
                                    return (
                                      <BartenderDisplay
                                        key={index}
                                        bartender={bartender}
                                        busyThatDay={busyThatDay}
                                      ></BartenderDisplay>
                                    );
                                  }
                                )}
                            </Grid>
                          </Grid>
                        )}
                      </>
                    )}

                    {stateTheEvent.where && (
                      <Grid container flexDirection="row">
                        <Grid item sx={{ width: "auto" }}>
                          <Typography
                            className="keyHeading"
                            style={{
                              fontWeight: "bold",
                              display: "inline",
                              marginRight: "4px",
                            }}
                          >
                            Where:
                          </Typography>{" "}
                          {stateTheEvent.where}
                        </Grid>
                        {/* <Grid
                          item
                          xs={10}
                          sx={{
                            width: "auto",
                            maxWidth: "100%",
                            marginTop: "-3px",
                          }}
                        >
                          <TextFieldWrapper
                            name="where"
                            placeholder="Where"
                            value={values.where || stateTheEvent.where || ""}
                            onChange={(value: string) =>
                              setFieldValue(
                                "where",
                                value !== null ? value : stateTheEvent.where
                              )
                            }
                          />
                        </Grid> */}
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

                    {values.basePackage && (
                      <Grid
                        container
                        flexDirection="row"
                        sx={{ flexWrap: "nowrap", width: "100%" }}
                        className="formValuesWrapper"
                      >
                        <Grid
                          item
                          sx={{
                            width: "auto",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography
                            className="keyHeading"
                            style={{
                              fontWeight: "bold",
                              display: "inline",
                              marginRight: "4px",
                            }}
                          >
                            Base Package:
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: "100%",
                            maxWidth: "100%",
                            marginTop: "-3px",
                          }}
                        >
                          {/* <TextFieldWrapper
                            name="basePackage"
                            placeholder="Package Base"
                            value={
                              (values.basePackage &&
                                values.basePackage.packageTitle) ||
                              ""
                            }
                            onChange={(value: string) => {
                              setFieldValue(
                                "basePackage",
                                value !== null ? value : ""
                              );
                            }}
                            // onBlur={(value: number) => {
                            //   setNumSetupHours(value);
                            // }}
                          /> */}

                          <Autocomplete
                            id={"basePackage"}
                            disableClearable
                            blurOnSelect
                            value={values.basePackage}
                            options={stateServicePackages}
                            getOptionLabel={(servPack: ServicePackage) => {
                              return (
                                servPack.packageTitle +
                                " ($" +
                                servPack.packagePrice +
                                ")" +
                                // " — " +
                                // servPack.guestRange +
                                // " guests" +
                                " — " +
                                (
                                  Number(servPack.hoursBarService) +
                                  Number(servPack.numSetupHours) +
                                  Number(servPack.numCleanupHours)
                                ).toString() +
                                " hours"
                              );
                            }}
                            // onFocus={() => {
                            //   dispatch(setRightToMakeChanges("FORM"));
                            // }}
                            onChange={(e: any, value: ServicePackage) => {
                              setFieldValue(
                                "basePackage",
                                value !== null ? value : {}
                              );

                              //console.log('values.cocktail', cocktail);
                            }}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Grid container alignItems="center">
                                  <Typography
                                    sx={{
                                      margin: "0 4px",
                                      fontSize: "14px",
                                      fontFamily: "var(--primary-font)",
                                    }}
                                  >
                                    {option.packageTitle} — {option.guestRange}
                                  </Typography>
                                </Grid>
                              </li>
                            )}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                sx={{ width: "100%" }}
                                variant="standard"
                                // label={`Base Package`}
                                name={"basePackage"}
                              />
                            )}
                          ></Autocomplete>
                        </Grid>
                      </Grid>
                    )}

                    <Grid
                      container
                      flexDirection="row"
                      sx={{ flexWrap: "nowrap", width: "100%" }}
                      className="formValuesWrapper"
                    >
                      <Grid
                        item
                        sx={{
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography
                          className="keyHeading"
                          style={{
                            fontWeight: "bold",
                            display: "inline",
                            marginRight: "4px",
                          }}
                        >
                          Base Price:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          marginTop: "-3px",
                        }}
                      >
                        <TextFieldWrapper
                          name="basePrice"
                          type="number"
                          placeholder="Base Price"
                          value={values.basePrice}
                          onChange={(value: number) => {
                            setFieldValue(
                              "basePrice",
                              value !== null ? value : 0
                            );
                          }}
                          // onBlur={(value: number) => {
                          //   setNumSetupHours(value);
                          // }}
                          sx={{
                            "& .MuiInput-root": {
                              fontWeight: "bold!important",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Typography
                                sx={{
                                  fontWeight: "bold!important",
                                  fontFamily: "var(--primary-font)",
                                }}
                              >
                                $
                              </Typography>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      flexDirection="row"
                      sx={{ flexWrap: "nowrap", width: "100%" }}
                      className="formValuesWrapper"
                    >
                      <Grid
                        item
                        sx={{
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography
                          className="keyHeading"
                          style={{
                            fontWeight: "bold",
                            display: "inline",
                            marginRight: "4px",
                          }}
                        >
                          Package Title:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          marginTop: "-3px",
                        }}
                      >
                        <TextFieldWrapper
                          name="packageTitle"
                          placeholder="Package Title"
                          value={values.packageTitle}
                          onChange={(value: string) => {
                            setFieldValue(
                              "packageTitle",
                              value !== null ? value : ""
                            );
                          }}
                          // onBlur={(value: number) => {
                          //   setNumSetupHours(value);
                          // }}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      flexDirection="row"
                      sx={{ flexWrap: "nowrap", width: "100%" }}
                      className="formValuesWrapper"
                    >
                      <Grid
                        item
                        sx={{
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography
                          className="keyHeading"
                          style={{
                            fontWeight: "bold",
                            display: "inline",
                            marginRight: "4px",
                          }}
                        >
                          Setup Hours:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          marginTop: "-3px",
                        }}
                      >
                        <TextFieldWrapper
                          name="numSetupHours"
                          type="number"
                          placeholder="Setup Hours"
                          value={values.numSetupHours}
                          onChange={(value: number) => {
                            setFieldValue(
                              "numSetupHours",
                              value !== null ? value : 0
                            );
                          }}
                          // onBlur={(value: number) => {
                          //   setNumSetupHours(value);
                          // }}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      flexDirection="row"
                      sx={{ flexWrap: "nowrap", width: "100%" }}
                      className="formValuesWrapper"
                    >
                      <Grid
                        item
                        sx={{
                          width: "auto",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography
                          className="keyHeading"
                          style={{
                            fontWeight: "bold",
                            display: "inline",
                            marginRight: "4px",
                          }}
                        >
                          Cleanup Hours:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          marginTop: "-3px",
                        }}
                      >
                        <TextFieldWrapper
                          name="numCleanupHours"
                          type="number"
                          placeholder="Cleanup Hours"
                          value={values.numCleanupHours}
                          onChange={(value: number) => {
                            setFieldValue(
                              "numCleanupHours",
                              value !== null ? value : 0
                            );
                          }}
                          // onBlur={(value: number) => {
                          //   setNumCleanupHours(value);
                          // }}
                        />
                      </Grid>
                    </Grid>

                    {stateTheEvent.barHours && numBarHours && (
                      <>
                        <Grid item>
                          <Typography>
                            <span
                              className="keyHeading"
                              style={{ fontWeight: "bold" }}
                            >
                              Bar Hours:
                            </span>{" "}
                            {stateTheEvent.barHours}
                            {" ("}
                            {numBarHours}
                            {` hour${
                              numBarHours && numBarHours > 1 ? "s" : ""
                            })`}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography>
                            <span
                              className="keyHeading"
                              style={{ fontWeight: "bold" }}
                            >
                              Total Duration:
                            </span>{" "}
                            {values.numTotalHours} hours
                            {" (from "}
                            {values.arriveAt}
                            {"  to "}
                            {values.leaveAt}
                            {")"}
                            {values.difFactoring && values.difFactoring > 0 ? (
                              <>
                                (<strong>+${values.difFactoring}</strong>)
                              </>
                            ) : (
                              ""
                            )}
                            {values.difFactoring && values.difFactoring < 0 ? (
                              <>
                                (
                                <strong>
                                  -${Math.abs(values.difFactoring)}
                                </strong>
                                )
                              </>
                            ) : (
                              ""
                            )}
                          </Typography>
                        </Grid>
                        {/* <Grid container flexDirection="row" className="barOpen">
                          <Grid item>
                            <Typography
                              className="keyHeading"
                              style={{
                                fontWeight: "bold",
                                display: "inline",
                                marginRight: "4px",
                              }}
                            >
                              Bar Open:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ maxWidth: "100%", marginTop: "-3px" }}
                          >
                            <TextFieldWrapper
                              name="barOpen"
                              placeholder="Bar Open"
                              value={
                                values.barOpen ||
                                stateTheEvent.barHours.match(
                                  /^\d+|\d+\b|\d+(?=\w)/g
                                )[0] ||
                                ""
                              }
                              onChange={(value: number) =>
                                setFieldValue(
                                  "barOpen",
                                  value !== null
                                    ? value
                                    : stateTheEvent.barHours
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          flexDirection="row"
                          className="barClose"
                        >
                          <Grid item>
                            <Typography
                              className="keyHeading"
                              style={{
                                fontWeight: "bold",
                                display: "inline",
                                marginRight: "4px",
                              }}
                            >
                              Bar Close:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{ maxWidth: "100%", marginTop: "-3px" }}
                          >
                            <TextFieldWrapper
                              name="barClose"
                              placeholder="Bar Close"
                              value={
                                values.barClose ||
                                stateTheEvent.barHours.match(
                                  /^\d+|\d+\b|\d+(?=\w)/g
                                )[1] ||
                                ""
                              }
                              onChange={(value: number) =>
                                setFieldValue(
                                  "barClose",
                                  value !== null
                                    ? value
                                    : stateTheEvent.barHours
                                )
                              }
                            />
                          </Grid>
                        </Grid> */}

                        <Grid
                          container
                          flexDirection="row"
                          className="servingSuggestion"
                        >
                          <Grid item>
                            <Typography
                              className="keyHeading"
                              style={{
                                fontWeight: "bold",
                                display: "inline",
                                marginRight: "4px",
                              }}
                            >
                              We suggest serving:
                            </Typography>
                            {stateTheEvent.guestCount * numBarHours} drinks
                          </Grid>
                        </Grid>
                      </>
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
                            {stateTheEvent.extraStuff &&
                              stateTheEvent.extraStuff.length > 0 && (
                                <ul style={{ margin: "0px" }}>
                                  {stateTheEvent.extraStuff.map(
                                    (extraThing: string) => {
                                      switch (extraThing) {
                                        case "ice":
                                          if (
                                            values?.basePackage?.includesExtraStuff?.includes(
                                              extraThing
                                            )
                                          ) {
                                            return <li>{extraThing}</li>;
                                          } else {
                                            return (
                                              <li>
                                                {extraThing} (~
                                                {stateTheEvent.guestCount * 2}
                                                lbs:{" "}
                                                <strong>
                                                  +$
                                                  {stateTheEvent.guestCount * 2}
                                                </strong>
                                                )
                                              </li>
                                            );
                                          } //2lbs per person // $1/lb.
                                        case "Mini Bar (4'x5' portable bar)":
                                          if (
                                            values?.basePackage?.includesExtraStuff?.includes(
                                              extraThing
                                            )
                                          ) {
                                            return <li>{extraThing}</li>;
                                          } else {
                                            return (
                                              <li>
                                                {extraThing} (
                                                <strong>+$125</strong>)
                                              </li>
                                            );
                                          }
                                        default:
                                          return <li>{extraThing}</li>;
                                      }
                                    }
                                  )}
                                </ul>
                              )}
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
                            style={{ fontWeight: "bold", color: "var(--gray)" }}
                          >
                            Inquired On:
                          </span>{" "}
                          <span style={{ color: "var(--gray)" }}>
                            {new Date(
                              stateTheEvent.$createdAt
                            ).toLocaleDateString("en-US", {
                              timeZone: "UTC",
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            {new Date(
                              stateTheEvent.$createdAt
                            ).toLocaleTimeString("en-US")}
                          </span>
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Grid
                    item
                    container
                    className="draftQuote"
                    sx={{ maxWidth: "980px", width: "60%", margin: "20px" }}
                  >
                    <DraftQuote
                      {...stateTheEvent}
                      barOpenAt={values.barOpensAt}
                      barCloseAt={values.barClosesAt}
                      numBarHours={values.numBarHours}
                      packageTitle={values.packageTitle}
                      packagePrice={values.packagePrice}
                      numBartenders={values.numBartenders}
                      numBarbacks={values.numBarbacks}
                      numSetupHours={values.numSetupHours}
                      numCleanupHours={values.numCleanupHours}
                      arriveAt={values.arriveAt}
                      leaveAt={values.leaveAt}
                      guestRange={values.guestRange}
                      numTotalHours={values.numTotalHours}
                    ></DraftQuote>
                  </Grid>
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
