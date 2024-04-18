import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { account, databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { useNavigate, Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import NavBar from "./NavBar";
import CocktailSelect from "./CocktailSelect";
import GroceryList from "./GroceryList";
import DraggablePieChart from "./DraggablePieChart";

import WineBarTwoToneIcon from "@mui/icons-material/WineBarTwoTone";
import LocalBarTwoToneIcon from "@mui/icons-material/LocalBarTwoTone";
import SportsBarTwoToneIcon from "@mui/icons-material/SportsBarTwoTone";
import LocalDrinkTwoToneIcon from "@mui/icons-material/LocalDrinkTwoTone";

import { v4 as uuidv4 } from "uuid";

import {
  addCocktail,
  addWine,
  addBeer,
  removeCocktail,
  removeWine,
  removeBeer,
  setGroceryItemList,
} from "../reducers/groceriesSlice";
import { setCocktailList } from "../reducers/cocktailListSlice";

// import { setEventsList } from "../reducers/eventListSlice";
// import { setRightToMakeChanges } from "../reducers/appSlice";
import { useAppSelector, useAppDispatch } from "../reducers/hooks";

import { Cocktail } from "../types/Cocktail";
import WineSelect from "./WineSelect";
import BeerSelect from "./BeerSelect";
import EventDetails from "./EventDetails";
import ServingsStats from "./ServingsStats";

//import AutocompleteWrapper from './common/AutoComplete';

// type Cocktail = {
// 	cocktail?: {
// 		$id?: number;
// 		category?: string;
// 		extraIngredients?: string[];
// 		garnish?: string[];
// 		img?: string;
// 		liquor?: string;
// 		liquorParts?: number;
// 		mixer1?: string;
// 		mixer1Parts?: number;
// 		mixer2?: string;
// 		mixer2Parts?: number;
// 		mixer3?: string;
// 		mixer3Parts?: number;
// 		mixer4?: string;
// 		mixer4Parts?: number;
// 		name?: string;
// 		recipe?: string;
// 	};
// };

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [auth, setAuth] = useState<any>({});
  // const [events, setEvents] = useState<any[]>([]);

  //const [numCocktails, setNumCocktails] = useState(1);

  const stateCocktailsLength = useAppSelector(
    (state: any) => state.groceries.cocktails.length
  );
  const stateWinesLength = useAppSelector(
    (state: any) => state.groceries.wines.length
  );
  const stateBeersLength = useAppSelector(
    (state: any) => state.groceries.beers.length
  );
  const stateGroceryCocktails = useAppSelector(
    (state: any) => state.groceries.cocktails
  );
  const stateGroceryWines = useAppSelector(
    (state: any) => state.groceries.wines
  );
  const stateGroceryBeers = useAppSelector(
    (state: any) => state.groceries.beers
  );
  const stateApp = useAppSelector((state: any) => state.app.cocktailsUpdate);
  // const stateEvents = useAppSelector((state: any) => state.events.events);
  useEffect(() => {
    //console.log('useEffect(),[account]');
    const user = account.get();

    user.then(
      function (response) {
        //console.log('user', response); // Success
        setAuth(response);
      },
      function (error) {
        console.log(error); // Failure
        navigate("/");
      }
    );
  }, [account]);

  useEffect(() => {
    const cocktails = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_COCKTAILS_COLLECTION_ID, //collection_id - Cocktails
      [Query.orderAsc("category"), Query.orderAsc("name"), Query.limit(100)] // queries
      // 100, // limit
      // 0, // offset
      // '', // cursor
      // 'after', // cursorDirection
      // ['category', 'name'], // orderAttributes
      // ['ASC', 'ASC'] // orderTypes
    );

    cocktails.then(
      function (response: any) {
        // console.log(response); // Success
        dispatch(setCocktailList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );

    const groceryItems = databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
      import.meta.env.VITE_APPWRITE_GROCERY_ITEMS_COLLECTION_ID, //collection_id - groceryItems
      [Query.orderAsc("container"), Query.orderAsc("title"), Query.limit(100)] // queries
      // 100, // limit
      // 0, // offset
      // '', // cursor
      // 'after', // cursorDirection
      // ['category', 'name'], // orderAttributes
      // ['ASC', 'ASC'] // orderTypes
    );

    groceryItems.then(
      function (response: any) {
        // console.log(response); // Success
        dispatch(setGroceryItemList(response.documents));
        //setCocktails(response.documents);
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  }, [stateApp]);

  // useEffect(() => {
  //   const typeformEvents = databases.listDocuments(
  //     import.meta.env.VITE_APPWRITE_DATABASE_ID, //database_id
  //     import.meta.env.VITE_APPWRITE_TYPEFORM_EVENTS_COLLECTION_ID, // collectionId - typeformEvents
  //     [Query.orderAsc("email")] // queries
  //     // 100, // limit
  //     // 0, // offset
  //     // '', // cursor
  //     // 'after', // cursorDirection
  //     // ['category', 'name'], // orderAttributes
  //     // ['ASC', 'ASC'] // orderTypes
  //   );

  //   typeformEvents.then(
  //     function (response: any) {
  //       // console.log(response); // Success
  //       dispatch(setEventsList(response.documents));
  //       //setCocktails(response.documents);
  //     },
  //     function (error) {
  //       console.log(error); // Failure
  //     }
  //   );
  // }, [stateApp]);

  // useEffect(() => {
  //   setEvents(stateEvents);
  // }, [stateEvents]);

  //Cocktails
  const [cocktailFields, setCocktailFields] = useState<any>([]);

  useEffect(() => {
    setCocktailFields(
      stateGroceryCocktails &&
        stateGroceryCocktails.map((cocktail: any, index: number) => {
          return (
            <Grid
              item
              key={index}
              // onClick={() => dispatch(setRightToMakeChanges("FORM"))}
            >
              <CocktailSelect
                key={cocktail.index}
                fieldID={cocktail.fieldID}
                removeCocktail={(fieldID) => {
                  dispatch(removeCocktail({ fieldID: fieldID }));
                }}
                cIndex={index + 1}
                cocktail={cocktail}
                name={cocktail.name}
                servings={cocktail.servings}
              />
            </Grid>
          );
        })
    );
    console.log("cocktailFields", cocktailFields);
  }, [stateCocktailsLength]);
  // }, [stateCocktailsLength, stateGroceryCocktails]); //this creates a weird loop

  //Wines
  const [wineFields, setWineFields] = useState<any>([]);

  useEffect(() => {
    setWineFields(
      stateGroceryWines &&
        stateGroceryWines.map((wine: any, index: number) => {
          return (
            <Grid
              item
              // onClick={() => dispatch(setRightToMakeChanges("FORM"))}
            >
              <WineSelect
                key={wine.index}
                fieldID={wine.fieldID}
                removeWine={(fieldID) => {
                  dispatch(removeWine({ fieldID: fieldID }));
                }}
                cIndex={index + 1}
                name={wine.name}
                servings={wine.servings}
              />
            </Grid>
          );
        })
    );
    console.log("wineFields", wineFields);
  }, [stateWinesLength]);

  //Beers
  const [beerFields, setBeerFields] = useState<any>([]);

  useEffect(() => {
    setBeerFields(
      stateGroceryBeers &&
        stateGroceryBeers.map((beer: any, index: number) => {
          console.log("beer", beer);
          return (
            <Grid
              item
              // onClick={() => dispatch(setRightToMakeChanges("FORM"))}
            >
              <BeerSelect
                key={beer.index}
                fieldID={beer.fieldID}
                removeBeer={(fieldID) => {
                  dispatch(removeBeer({ fieldID: fieldID }));
                }}
                cIndex={index + 1}
                name={beer.name}
                servings={beer.servings}
              />
            </Grid>
          );
        })
    );
    console.log("beerFields", beerFields);
  }, [stateBeersLength]);

  return (
    <>
      {auth && auth.$id && (
        <>
          <NavBar></NavBar>
          {/* <EventDetails></EventDetails> */}
          <Grid
            container
            className="dashboard"
            sx={{ justifyContent: "space-around", flexDirection: "row" }}
          >
            <Grid item md={5} className="cocktailCalc">
              <Grid item xs={12}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cocktail Calculator
                </Typography>
              </Grid>
              <Grid
                item
                sx={{ flexDirection: "column", alignItems: "center" }}
                className="cocktailSelects"
              >
                {cocktailFields}
                <LocalBarTwoToneIcon
                  sx={{
                    backgroundColor: "var(--orange)",
                    color: "#fff",
                    borderRadius: "100px",
                    padding: "8px",
                    transform: "scale(1)",
                    fontSize: "30px",
                    cursor: "pointer",
                    transition: "all .3s cubic-bezier(.53,-0.25,.14,1)",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                  onClick={() => {
                    // dispatch(setRightToMakeChanges("FORM"));
                    dispatch(
                      addCocktail({
                        index: stateCocktailsLength,
                        fieldID: uuidv4(),
                      })
                    );

                    //setNumCocktails(numCocktails + 1);
                  }}
                />
              </Grid>
              <Grid
                item
                sx={{ flexDirection: "column", alignItems: "center" }}
                className="wineSelects"
              >
                {wineFields}
                <WineBarTwoToneIcon
                  sx={{
                    backgroundColor: "var(--purple)",
                    color: "#fff",
                    borderRadius: "100px",
                    padding: "8px",
                    transform: "scale(1)",
                    fontSize: "30px",
                    cursor: "pointer",
                    transition: "all .3s cubic-bezier(.53,-0.25,.14,1)",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                  onClick={() => {
                    // dispatch(setRightToMakeChanges("FORM"));
                    dispatch(
                      addWine({
                        index: stateWinesLength,
                        fieldID: uuidv4(),
                      })
                    );

                    //setNumCocktails(numCocktails + 1);
                  }}
                />
              </Grid>
              <Grid
                item
                sx={{ flexDirection: "column", alignItems: "center" }}
                className="beerSelects"
              >
                {beerFields}
                <SportsBarTwoToneIcon
                  sx={{
                    backgroundColor: "var(--green)",
                    color: "#fff",
                    borderRadius: "100px",
                    padding: "8px",
                    transform: "scale(1)",
                    fontSize: "30px",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all .3s cubic-bezier(.53,-0.25,.14,1)",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                  onClick={() => {
                    // dispatch(setRightToMakeChanges("FORM"));
                    dispatch(
                      addBeer({
                        index: stateBeersLength,
                        fieldID: uuidv4(),
                      })
                    );

                    // 	//setNumCocktails(numCocktails + 1);
                  }}
                />
              </Grid>
              {/* <Grid
								item
								sx={{ flexDirection: 'column', alignItems: 'center' }}
								className='nonAlcoholicSelects'
							>
								{wineFields}
								<LocalDrinkTwoToneIcon
									sx={{
										backgroundColor: 'var(--teal)',
										color: '#fff',
										borderRadius: '100px',
										padding: '8px',
										transform: 'scale(1)',
										fontSize: '30px',
										cursor: 'pointer',
										transition: 'all .3s cubic-bezier(.53,-0.25,.14,1)',
										'&:hover': { transform: 'scale(1.2)' },
									}}
									onClick={() => {
										dispatch(setRightToMakeChanges('FORM'));
										dispatch(
											addNonAlcoholic({
												index: stateNonAlcoholicLength,
												fieldID: uuidv4(),
											})
										);

										//setNumCocktails(numCocktails + 1);
									}}
								/>
							</Grid> */}
            </Grid>
            {((stateGroceryCocktails.length > 0 &&
              stateGroceryCocktails[0].$id) ||
              (stateGroceryWines.length > 0 && stateGroceryWines[0].name) ||
              (stateGroceryBeers.length > 0 && stateGroceryBeers[0].name)) && (
              <Grid item sm={3} className="dashboardPieChartContainer">
                <DraggablePieChart />
                <ServingsStats></ServingsStats>
              </Grid>
            )}
            {/* END .cocktailCalc */}
            <GroceryList />
          </Grid>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
