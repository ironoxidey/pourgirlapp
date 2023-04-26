import React, { useEffect, useState } from "react";
import { toTitleCase } from "./common/toTitleCase";

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
  barOpenAt?: number;
  barCloseAt?: number;
  numBarHours?: number;
  packageTitle?: string;
  packagePrice?: number;
  numBartenders?: number;
  numBarbacks?: number;
  numSetupHours?: number;
  numCleanupHours?: number;
  arriveAt?: string;
  leaveAt?: string;
  guestRange?: string;
  numTotalHours?: number;
};

const DraftQuote = (props: propsTypes) => {
  //   const [props.packageTitle, setprops.PackageTitle] = useState<string>();
  //   const [props.packagePrice, setprops.PackagePrice] = useState<number>();
  //   const [props.numBartenders, setprops.NumBartenders] = useState<number>();
  //   const [props.numBarbacks, setprops.NumBarbacks] = useState<number>();
  //   const [props.numSetupHours, setprops.NumSetupHours] = useState<number>();
  //   const [props.numCleanupHours, setprops.NumCleanupHours] = useState<number>();
  //   const [props.arriveAt, setprops.ArriveAt] = useState<string>();
  //   const [props.leaveAt, setprops.LeaveAt] = useState<string>();
  //   const [props.guestRange, setprops.GuestRange] = useState<string>();
  //   const [props.numTotalHours, setprops.NumTotalHours] = useState<number>();
  //   useEffect(() => {
  //     if (props) {
  //       setprops.PackageTitle("");
  //       setprops.PackagePrice(0.0);
  //       setprops.NumBartenders(1);
  //       setprops.NumBarbacks(0);
  //       let calcPrice = 0;
  //       let calcSetupHours = 0;
  //       let calcCleanupHours = 0;
  //       if (props.guestCount) {
  //         if (props.guestCount < 51) {
  //           if (
  //             props.extraStuff &&
  //             props.extraStuff.indexOf("Mini Bar (4'x5' portable bar)") > -1
  //           ) {
  //             calcSetupHours = 2;
  //             calcCleanupHours = 1;
  //             setprops.PackageTitle("Pretty Penny Plus");
  //             setprops.GuestRange("50 or less");
  //             calcPrice = 995.0;
  //             setprops.NumBartenders(1);
  //           } else {
  //             calcSetupHours = 2;
  //             calcCleanupHours = 0.5;
  //             setprops.PackageTitle("Pretty Penny");
  //             setprops.GuestRange("50 or less");
  //             calcPrice = 895.0;
  //             setprops.NumBartenders(1);
  //           }
  //           if (props.numBartenders && props.numBarHours && props.numBarHours > 3) {
  //             calcPrice += (props.numBarHours - 3) * 75 * props.numBartenders;
  //           }
  //           if (props.numBartenders && props.numBarHours && props.numBarHours < 3) {
  //             calcPrice -= (3 - props.numBarHours) * 75 * props.numBartenders;
  //           }
  //         } //if (props.guestCount < 51)
  //         else if (props.guestCount > 50 && props.guestCount < 101) {
  //           calcSetupHours = 2;
  //           calcCleanupHours = 0.5;
  //           setprops.PackageTitle("Rags to Riches");
  //           setprops.GuestRange("50-100");
  //           calcPrice = 1895.0;
  //           setprops.NumBartenders(2);
  //           if (props.numBartenders && props.numBarHours && props.numBarHours > 5.5) {
  //             calcPrice += (props.numBarHours - 5.5) * 75 * props.numBartenders;
  //           }
  //           if (props.numBartenders && props.numBarHours && props.numBarHours < 5.5) {
  //             calcPrice -= (5.5 - props.numBarHours) * 75 * props.numBartenders;
  //           }
  //         } //else if (props.guestCount > 50 && props.guestCount < 101)
  //         else if (props.guestCount > 100 && props.guestCount < 151) {
  //           calcSetupHours = 2;
  //           calcCleanupHours = 0.5;
  //           setprops.PackageTitle("Rags to Riches Plus");
  //           setprops.GuestRange("100-150");
  //           calcPrice = 2595.0;
  //           setprops.NumBartenders(2);
  //           setprops.NumBarbacks(1);
  //           if (props.numBartenders && props.numBarHours && props.numBarHours > 5.5) {
  //             calcPrice += (props.numBarHours - 5.5) * 75 * props.numBartenders;
  //           }
  //           if (props.numBartenders && props.numBarHours && props.numBarHours < 5.5) {
  //             calcPrice -= (5.5 - props.numBarHours) * 75 * props.numBartenders;
  //           }
  //         } //else if (props.guestCount > 100 && props.guestCount < 151)

  //         // if (props.extraStuff && props.extraStuff.indexOf("Bar Bella") > -1) {
  //         //   calcPrice += 500;
  //         // }

  //         const arrivalTime =
  //           props.barOpenAt && Number(props.barOpenAt) - calcSetupHours;
  //         const departureTime =
  //           props.barCloseAt && Number(props.barCloseAt) + calcCleanupHours;

  //         setprops.NumTotalHours(
  //           props.numBarHours &&
  //             props.numBarHours + calcSetupHours + calcCleanupHours
  //         );

  //         setprops.ArriveAt(() => {
  //           if (arrivalTime && arrivalTime >= 1) {
  //             const hours = Number(arrivalTime.toString().split(".")[0]);
  //             const minutes =
  //               (Number(arrivalTime.toString().split(".")[1]) / 10) * 60;
  //             const amPM = hours > 9 ? "am" : "pm";
  //             return hours + ":" + (minutes || "00") + amPM;
  //           } else if ((arrivalTime && arrivalTime < 1) || arrivalTime === 0) {
  //             const hours = 12 + Number(arrivalTime.toString().split(".")[0]);
  //             const minutes =
  //               (Number(arrivalTime.toString().split(".")[1]) / 10) * 60;
  //             const amPM = hours > 9 && hours != 12 ? "am" : "pm";
  //             return hours + ":" + (minutes || "00") + amPM;
  //           } else {
  //             return;
  //           }
  //         });
  //         setprops.LeaveAt(() => {
  //           if (departureTime) {
  //             const hours = Number(departureTime.toString().split(".")[0]);
  //             const minutes =
  //               (Number(departureTime.toString().split(".")[1]) / 10) * 60;
  //             const amPM = hours === 12 ? "am" : "pm";
  //             return hours + ":" + (minutes || "00") + amPM;
  //           } else {
  //             return;
  //           }
  //         });
  //         setprops.NumSetupHours(calcSetupHours);
  //         setprops.NumCleanupHours(calcCleanupHours);
  //         setprops.PackagePrice(calcPrice);
  //       } //if (props.guestCount)
  //     }
  //   }, [props]);

  const [barOpensAt, setBarOpensAt] = useState<string>();
  const [barClosesAt, setBarClosesAt] = useState<string>();

  useEffect(() => {
    if (props.barOpenAt) {
      if (Number.isInteger(props.barOpenAt)) {
        setBarOpensAt(props.barOpenAt.toString());
      } else {
        const barOpenSplit = props.barOpenAt.toString().split(".");
        const barOpenInterpretted: string =
          barOpenSplit[0] + ":" + (Number(barOpenSplit[1]) / 10) * 60;
        setBarOpensAt(barOpenInterpretted);
      }
    }
    if (props.barCloseAt) {
      if (Number.isInteger(props.barCloseAt)) {
        setBarClosesAt(props.barCloseAt.toString());
      } else {
        const barCloseSplit = props.barCloseAt.toString().split(".");
        const barCloseInterpretted: string =
          barCloseSplit[0] + ":" + (Number(barCloseSplit[1]) / 10) * 60;
        setBarClosesAt(barCloseInterpretted);
      }
    }
  }, [props.barOpenAt, props.barCloseAt]);

  return (
    <>
      <Grid
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
          width: "100%",
          textAlign: "left",
          padding: "20px",
          overflowY: "scroll",
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Quote Email
        </Typography>
        <p>Hello {toTitleCase(props.name?.split(" ")[0] || "")},</p>
        <p>
          Thank you for your email. We would love to provide craft cocktail and
          full beverage service for your event. Below is a quote for you; please
          look it over and let me know if you have any questions. If you would
          like to move forward, reply to this email.
        </p>
        <p>
          Cheers,
          <br />
          Olana
        </p>

        <img
          src="https://lh4.googleusercontent.com/2-eDJdsNOYyUFlch92pea-RdMVyRpJ0NNFMwyKivyYLLrVKq-sTtE4CiYsNz7LR2Jq9Dxtqbt9XHpg_ZkX_ekHJ_L7owbWmK3YyuJ4AluBrGMfhMQ2GZ3TPyTpP82dvuDiCKmTbpkky4ve7sryFHJg"
          width="111"
          height="165"
        />

        <img
          src="https://lh5.googleusercontent.com/w8u-GvU3pdXNAnaBswAYMpBi3LIIYh0yP_BAdTA1iVkGysS-Lj_f1ElPr02XZjbt1hwkWfWVrKqs8G34VVfbN6QgUdBWC25NZToWypv_Y3Xg2Kd73acAuGmRdyq-IaD9mRqPvJClifTye5GsESoRDQ"
          width="111"
          height="165"
        />
        <img
          src="https://lh3.googleusercontent.com/-4mGodxNvsj9QaJjM5E3aXtLryqo0XQZpn8x-Msh9vDmbf5IeWa-llqQStS-_wXVFOKgzhWN_KrHGDUdyNQTztzcQAN1rdSplxKk106EmhMBXiOHjWVNL0allMaRuxu9jsp3eq9mAKQc8C8d4msXHA"
          width="111"
          height="165"
        />
        <img
          src="https://lh6.googleusercontent.com/yYaKWRS48RGwYQPhvvN4LKbytSFrnuM3eZeZbXNDqtaHmsVAdDI64UELqi_yFNlfu0ytg75sMdzcyHUiHWTCrx8UfeA74h22dmbzcN_tHHDvucajHn7pp0qNhgbKbVOywJgnuje241DgdYdYayW62w"
          width="111"
          height="165"
        />
        <img
          src="https://lh6.googleusercontent.com/yCy6qnsLO5vItbrb0CGJh_mJywmO6ze2RRqdESHRv01FGYzL7KxuQmrGpqqU5J-AhOBTCW97L87a34zxuppVrHxgOEMeTmvkq__WZZ5Y-GRbTYn0TqfzYXK8JbG52lUdRtdPgaaJ0srWJuC-t11VzA"
          width="111"
          height="165"
        />
        <p>
          <b>
            <em>
              {props.packageTitle}: $
              {(Math.round((props.packagePrice || 0) * 100) / 100).toFixed(2)}
            </em>
          </b>
        </p>
        <p>
          This service package, designed for a guest count of {props.guestRange}
          , includes:
          <ul>
            <li>
              {props.numBartenders} Pour Girl Bartender
              {props.numBartenders && props.numBartenders > 1 ? "s" : ""}
              {props.numBarbacks && props.numBarbacks > 0
                ? ", " +
                  props.numBarbacks +
                  " Barback" +
                  (props.numBarbacks > 1 ? "s" : "")
                : ""}
            </li>
            {props.packageTitle === "Rags to Riches" && (
              <li>
                Service for up to two bar locations (additional 0.5 hour setup
                time will be added for a second bar)
              </li>
            )}
            {props.packageTitle === "Rags to Riches Plus" && (
              <li>
                Service for one bar location (additional 0.5 hour setup time
                will be added for a second bar)
              </li>
            )}
            {props.packageTitle === "Pretty Penny Plus" && (
              <li>
                Our{" "}
                <a href="https://www.instagram.com/p/BpOcUxtAiqN/">
                  4'x5' Mini Bar
                </a>{" "}
                (<em>plus back bar table</em>)
              </li>
            )}
            <li>
              {props.numSetupHours} hour
              {props.numSetupHours && props.numSetupHours > 1 ? "s" : ""} set-up
              & {props.numBarHours} hour
              {props.numBarHours && props.numBarHours > 1 ? "s" : ""} of bar
              service,{" "}
              {props.numCleanupHours && props.numCleanupHours < 1
                ? props.numCleanupHours * 60 + "-minute "
                : props.numCleanupHours + "-hour "}{" "}
              cleanup (Bar open from: {barOpensAt}
              {props.barOpenAt && props.barOpenAt > 9 ? "am" : "pm"} to{" "}
              {barClosesAt}pm)
              {/* COME BACK TO THIS!!! I don't like assuming "pm", but I can't mess with it right now. ~April 25th, 2023 */}
              {/* ({props.arriveAt} to {props.leaveAt} —{" "}
              {props.numTotalHours} hour total duration) */}
            </li>
            <li>
              Customized beverage menu & shopping list for your choice of
              signature cocktails, seasonal mocktails, and/or beer and wine
            </li>
            <li>
              <a href="https://www.instagram.com/p/CUvNRVAPcXi/">
                Beverage menu
              </a>{" "}
              to display on the bar
              {props.numBartenders && props.numBartenders > 1 ? "(s)" : ""}
            </li>
            <li>Beverage napkins</li>
            <li>
              Our bar tools (i.e corkscrew, bottle opener, shaker & strainer,
              muddler, bar towel, knife & cutting board, ice bucket & scoop)
            </li>
            {(props.packageTitle === "Rags to Riches" ||
              props.packageTitle === "Rags to Riches Plus") && (
              <>
                <li>
                  All necessary ice chests, coolers, garnish containers &
                  dispensers for the bar
                </li>
                <li>
                  Water in a self serve dispenser for guests to stay hydrated at
                  the bar
                </li>
              </>
            )}

            <li>
              Liquor liability insurance, ServSafe Alcohol certification,
              Sommelier License
            </li>
            <li>20% gratuity included</li>
          </ul>
        </p>
        <p>
          <b>For additional needs, please see the “Extras” section below.</b>
        </p>
        <p>
          <b>50% DOWN PAYMENT REQUIRED TO SECURE THE DATE</b>
        </p>
        <p>
          <b>Extras:</b>
          <ul>
            <li>
              <a href="https://pourgirlbartending.com/#bar-bella">Bar Bella</a>:
              $500
            </li>
            <li>Ice Service: $1/lb.</li>
            {props.extraStuff &&
              props.extraStuff.indexOf("Mini Bar (4'x5' portable bar)") ===
                -1 && (
                <li>
                  <a href="https://www.instagram.com/p/BpOcUxtAiqN/">
                    4x5 Mini Bar
                  </a>
                  : $125
                </li>
              )}

            <li>Back Bar Tables + Cloth: $45</li>
            <li>Compostable Cups: $35 per 100 count</li>
            <li>Beverage Dispensers for self-serve beverages: $18</li>
            <li>20 Gallon Circular Ice Tubs for self-serve bottles: $18</li>
            <li>
              Welcome Beverage Station: <em>inquire for pricing</em>
            </li>
            <li>
              Tableside Wine Pouring: <em>inquire for pricing</em>
            </li>
            <li>
              Champagne Toast Service: <em>inquire for pricing</em>
            </li>
            <li>One Hour Consultation/Additional Service: $75</li>
            <li>
              Seasonal & Organic Homemade Mixers: <em>market price</em>
            </li>
          </ul>
        </p>
        <p>
          <em>Please note:</em>
        </p>
        <p>
          We do not sell alcohol. The host or client can do their own purchasing
          of liquor, beer, mixers, sodas, water, and wine from a customized list
          sent by us, allowing them to work within their own specific
          preferences and budget.
        </p>
        <p>
          Glassware is not included. We are happy to advise on types and
          quantities for glassware rentals. Alternatively, we can provide our 12
          oz. compostable cups ($35/100).{" "}
        </p>
        <p>We have a lengthy list of 5-Star Yelp reviews. Check them out! </p>
        <img
          src="https://lh6.googleusercontent.com/v6ySwWcpPE1Kernnd-M5vPAcvUfj7iycO3VCXKfVX2-RdYGsA93yyX0eABZOewQdpa1jLol3bUW0llJ8yKs8uYQd39oH7Wn9MIK-YqF431oJznGtP1pZK3LhIY-flvWgZyVsVPUN"
          width="110"
          height="165"
        />
        <img
          src="https://lh6.googleusercontent.com/ud8eN_p0hZgAQ0VngO_mo6jloF3FyiRDlcsdwNSWcpZ9Yj9bDy4fRIp2a2gxhvjIynl_Fn2s5NXQ3AEmD427NCp9R7deJZqaxb2gLy6WvJfkC0ZgaAPL3ZR4WCVuOzEv-6DJEyQM"
          width="110"
          height="165"
        />
        <img
          src="https://lh4.googleusercontent.com/qcmnYmQQT5Z_RUZvFfcUlPNeyKPtTqdtA_67VWW3kmSKDPlPk5BnIcaS1qtMrTKt4SFb4EkSFkmBnERI5FBYmSI8IrgQosDMH2eO0_BYj_vo0rGnFr5HGZnkoxSag9b8VH0zIeYc"
          width="110"
          height="165"
        />
        <img
          src="https://lh5.googleusercontent.com/Oz2QcswzSPRPSqRBsYzwfOXtP5W9C5_Uo8Lwk2akAFt-YAeG041qMwnOAcjweMYlR5jomZkHa1ivoc1tdsHNhl8RD31GdPSf2HNNVtMKRQgDVGMQXLoqwW69x8_3vcj0CIf5SVwk"
          width="110"
          height="165"
        />
        <img
          src="https://lh6.googleusercontent.com/wd1bAzmXhkJWy-UhXT8MubYHVhflS44GQoCX1Dqc26UZ_rm6Y_Y-R_PKaR7q7XHH49q5KRD50QeCt3k_pu-TmccfGWpbdmsf9IQGul01GdrLdCUSD7btRgVhQKokd1uAycTGdQcK"
          width="110"
          height="168"
        />
      </Grid>
    </>
  );
};

export default DraftQuote;
