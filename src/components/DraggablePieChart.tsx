//copied the bulk of this from the example.js in the /draggable-piechart/ folder
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
// @ts-ignore: I don't know how to set up the draggable-piechart.js file to be imported the way it wants, but it's working...
import DraggablePiechart from "../draggable-piechart/draggable-piechart";
import { useAppSelector, useAppDispatch } from "../reducers/hooks";
import { Cocktail } from "../types/Cocktail";
import { Wine } from "../types/Wine";
import { Beer } from "../types/Beer";
import {
  updateCocktail,
  updateWine,
  updateBeer,
} from "../reducers/groceriesSlice";
import {
  setRightToMakeChanges,
  setLastToMakeChanges,
} from "../reducers/appSlice";

const DraggablePieChart = () => {
  const groceriesCocktails = useAppSelector(
    (state: any) => state.groceries.cocktails
  );
  const groceriesWines = useAppSelector((state: any) => state.groceries.wines);
  const groceriesBeers = useAppSelector((state: any) => state.groceries.beers);

  const dispatch = useAppDispatch();

  const appRightToMakeChanges: string = useAppSelector(
    (state: any) => state.app.rightToMakeChanges
  );
  const appLastToMakeChanges: string = useAppSelector(
    (state: any) => state.app.lastToMakeChanges
  );

  // const [stateRightToMakeChanges, setStateRightToMakeChanges] =
  //   useState("FORM");

  // useEffect(() => {
  //   setStateRightToMakeChanges(appRightToMakeChanges);
  // }, [appRightToMakeChanges]);

  const calcNewTotalServings = () =>
    [
      ...[
        groceriesCocktails.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
      ...[
        groceriesWines.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
      ...[
        groceriesBeers.reduce((acc: any, curr: { servings: any }) => {
          if (curr.servings > 0) {
            return acc + curr.servings;
          } else {
            return acc;
          }
        }, 0),
      ],
    ].reduce((acc, curr) => acc + curr, 0);

  const updateServings = (percentages: []) => {
    console.log("updating Servings");

    if (appLastToMakeChanges !== "CHART") {
      dispatch(setLastToMakeChanges("CHART"));
    }

    const totalServings = calcNewTotalServings();
    console.log("totalServings", totalServings);

    // console.log(
    //   "groceriesCocktails.length + groceriesWines.length + groceriesBeers.length",
    //   groceriesCocktails.length + groceriesWines.length + groceriesBeers.length
    // );

    if (
      // totalServings === 1000 &&
      percentages.length ===
      groceriesCocktails.length + groceriesWines.length + groceriesBeers.length
    ) {
      if (groceriesCocktails && groceriesCocktails.length > 0) {
        groceriesCocktails.map((cocktail: any) => {
          const newServings = Math.round(
            totalServings * (percentages[cocktail.index] / 100)
          );

          console.log(
            "cocktail" + cocktail.index,
            "newServings",
            newServings,
            "percentage",
            percentages[cocktail.index] / 100
          );
          if (newServings !== cocktail.servings)
            dispatch(
              updateCocktail({
                ...cocktail,
                servings: newServings,
              })
            );
        });
      }
      // if (groceriesWines && groceriesWines.length > 0) {
      //   groceriesWines.map((wine: any) => {
      //     const newServings = totalServings * (percentages[wine.index] / 100);
      //     dispatch(
      //       updateWine({
      //         ...wine,
      //         servings: newServings,
      //       })
      //     );
      //   });
      // }
      // if (groceriesBeers && groceriesBeers.length > 0) {
      //   groceriesBeers.map((beer: any) => {
      //     const newServings = totalServings * (percentages[beer.index] / 100);
      //     dispatch(
      //       updateBeer({
      //         ...beer,
      //         servings: newServings,
      //       })
      //     );
      //   });
      // }
    }
  };

  const canvasRef = useRef(null);

  //const numChartUpdates = useRef([0]); //increment and add new elements with index keys for every new chart

  useEffect(() => {
    const canvas = canvasRef.current;

    function fitToContainer(canvas: HTMLCanvasElement) {
      // Make it visually fill the positioned parent
      canvas.style.width = "100%";
      // ...then set the internal size to match
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetWidth; //to make it square
    }

    //var canvas: HTMLCanvasElement | null = document.querySelector('canvas');
    if (canvas) {
      fitToContainer(canvas);
    }
  }, []);

  const [newPie, setNewPie] = useState<DraggablePiechart>();

  const cleanup = () => {
    if (newPie) {
      setNewPie(null);
      // newPie.removeAllEventListeners(); // Remove all event listeners from the previous instance
      // const canvas = canvasRef.current;
      // if (canvas) {
      //   const ctx = canvas.getContext("2d");
      //   if (ctx) {
      //     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      //   }
      // }
    }
  };
  useEffect(() => {
    if (
      (groceriesCocktails.length > 0 && groceriesCocktails[0].$id) ||
      (groceriesWines.length > 0 && groceriesWines[0].name) ||
      (groceriesBeers.length > 0 && groceriesBeers[0].name)
    ) {
      // function setupPieChart() {
      //console.log('setupPieChart');
      // var dimensions: string[] = knuthfisheryates2([
      // 	'walking',
      // 	'programming',
      // 	'chess',
      // 	'eating',
      // 	'sleeping',
      // ]);
      // var foodProportions = [
      // 	{ proportion: 2, format: { color: '#81a2da', label: 'Pizza' } },
      // 	{ proportion: 1, format: { color: '#aed091', label: 'Pasta' } },
      // 	{ proportion: 0.5, format: { color: '#f9e58b', label: 'Noodles' } },
      // 	{ proportion: 2, format: { color: '#d48675', label: 'Curry' } },
      // 	{ proportion: 1.5, format: { color: '#e9aa90', label: 'Other' } },
      // ];
      // var randomProportions = generateRandomProportions(dimensions.length, 0.05);
      cleanup();

      var cocktailsProportions = groceriesCocktails.map(function (
        cocktail: { servings: number; fieldID: any; name: any },
        i: any
      ) {
        return {
          proportion: cocktail.servings ? cocktail.servings : 0,
          collapsed: cocktail.servings && cocktail.servings > 0 ? false : true,
          fieldID: cocktail.fieldID,
          format: {
            label: cocktail.name ? cocktail.name : "",
            color: "#f3b79c",
          },
        };
      });
      var winesProportions = groceriesWines.map(function (
        wine: { servings: number; fieldID: any; name: any },
        i: any
      ) {
        return {
          proportion: wine.servings ? wine.servings : 0,
          collapsed: wine.servings && wine.servings > 0 ? false : true,
          fieldID: wine.fieldID,
          format: {
            label: wine.name ? wine.name : "",
            color: "#867ab2",
          },
        };
      });
      var beersProportions = groceriesBeers.map(function (
        beer: { servings: number; fieldID: any; name: any },
        i: any
      ) {
        return {
          proportion: beer.servings ? beer.servings : 0,
          collapsed: beer.servings && beer.servings > 0 ? false : true,
          fieldID: beer.fieldID,
          format: {
            label: beer.name ? beer.name : "",
            color: "#86ab7f",
          },
        };
      });

      var proportions = cocktailsProportions
        .concat(winesProportions)
        .concat(beersProportions);

      var setup = {
        canvas: canvasRef.current, //document.getElementById('piechart'),
        radius: 0.9,
        //collapsing: true,
        proportions: proportions,
        // drawSegment: drawSegmentOutlineOnly,
        drawSegment: drawSegmentFillText,
        onchange: onPieChartChange,
      };

      //console.log('newPie', newPie);

      setNewPie(new DraggablePiechart(setup));

      //console.log('newPie', newPie);

      function drawSegmentFillText( //pulled this from the source code of https://raw.githack.com/heldersepu/draggable-piechart/master/example2.html linked from https://stackoverflow.com/a/61642962
        context: {
          strokeStyle: string;
          lineWidth: number;
          canvas: {
            height: number;
          };
          save: () => void;
          beginPath: () => void;
          moveTo: (arg0: any, arg1: any) => void;
          arc: (
            arg0: any,
            arg1: any,
            arg2: any,
            arg3: any,
            arg4: any,
            arg5: boolean
          ) => void;
          closePath: () => void;
          fillStyle: string;
          fill: () => void;
          stroke: () => void;
          restore: () => void;
          translate: (arg0: number, arg1: number) => void;
          rotate: (arg0: number) => void;
          textAlign: string;
          font: string;
          fillText: (arg0: string | number, arg1: number, arg2: number) => void;
          textBaseline: string;
          globalAlpha: number;
        },
        piechart: any,
        centerX: any,
        centerY: number,
        radius: number,
        startingAngle: number,
        arcSize: number,
        format: { color: any; label: string },
        collapsed: any
      ) {
        if (collapsed) {
          return;
        }

        var endingAngle = startingAngle + arcSize;
        var r = startingAngle + (endingAngle - startingAngle) / 3;
        var fontSize = Math.floor(context.canvas.height / 25);
        var dx = radius - fontSize;
        var dy = centerY / 10;
        var p = Math.round((100 * arcSize) / (Math.PI * 2));

        //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // Draw segment
        context.save();
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(
          centerX,
          centerY,
          radius,
          startingAngle,
          endingAngle,
          false
        );
        context.closePath();
        context.fillStyle = format.color;
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "#FFFFFF";
        context.stroke();
        context.restore();

        // Draw label on top
        context.save();
        context.translate(centerX, centerY);
        context.rotate(r);
        context.textAlign = "right";
        context.font = "bold " + fontSize + "pt Bree";
        context.fillStyle = "#FFFFFF";
        context.fillText(format.label, dx, dy);
        context.fillText(p + "%", dx, dy + 15);

        // Draw percent label
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.globalAlpha = 0.3;
        context.font = "bold " + fontSize * 3 + "pt Bree";
        context.fillStyle = "#FFFFFF";
        context.translate(dx / 1.3, dy);
        context.rotate(-r);
        context.fillText(p, 0, 0);
        context.restore();
      }

      function onPieChartChange(piechart: {
        getAllSliceSizePercentages: () => any;
        moveAngle: (arg0: any, arg1: number) => void;
      }) {
        //console.log('onPieChartChange');
        // var table: HTMLElement | null =
        // 	document.getElementById('proportions-table');
        var percentages = piechart.getAllSliceSizePercentages();
        console.log("percentages", percentages);
        if (appRightToMakeChanges === "CHART") {
          // updateServings(percentages);
        }
        // var labelsRow = "<tr>";
        // var propsRow = "<tr>";
        // for (var i = 0; i < proportions.length; i += 1) {
        //   labelsRow += "<th>" + proportions[i].format.label + "</th>";
        //   var v = "<var>" + percentages[i].toFixed(0) + "%</var>";
        //   var plus =
        //     '<div id="plu-' +
        //     groceriesCocktails[i].name +
        //     '" class="adjust-button" data-i="' +
        //     i +
        //     '" data-d="-1">&#43;</div>';
        //   var minus =
        //     '<div id="min-' +
        //     groceriesCocktails[i].name +
        //     '" class="adjust-button" data-i="' +
        //     i +
        //     '" data-d="1">&#8722;</div>';
        //   propsRow += "<td>" + v + plus + minus + "</td>";
        //   // console.log(
        //   // 	'useEffect stateRightToMakeChanges: ',
        //   // 	stateRightToMakeChanges
        //   // ); //for some reason this isn't staying up to date...
        //   // if (stateRightToMakeChanges === 'CHART') {
        //   // 	dispatch(
        //   // 		updateServings({
        //   // 			servings: proportions[i].proportion,
        //   // 			fieldID: proportions[i].fieldID,
        //   // 		})
        //   // 	);
        //   // }
        // }
        // labelsRow += "</tr>";
        // propsRow += "</tr>";
        // if (table) {
        // 	table.innerHTML = labelsRow + propsRow;
        // }
        // var adjust = document.getElementsByClassName('adjust-button');
        // function adjustClick(this: any) {
        // 	var i = this.getAttribute('data-i');
        // 	var d = this.getAttribute('data-d');
        // 	piechart.moveAngle(i, d * 0.1);
        // }
        // for (i = 0; i < adjust.length; i++) {
        // 	adjust[i].addEventListener('click', adjustClick);
        // }
      }

      /*
       * Generates n proportions with a minimum percentage gap between them
       */
      // function generateRandomProportions(n: any, min: number) {
      // 	// n random numbers 0 - 1
      // 	var rnd = Array.apply(null, { length: n }).map(function () {
      // 		return Math.random();
      // 	});

      // 	// sum of numbers
      // 	var rndTotal = rnd.reduce(function (a, v) {
      // 		return a + v;
      // 	}, 0);

      // 	// get proportions, then make sure each propoertion is above min
      // 	return validateAndCorrectProportions(
      // 		rnd.map(function (v) {
      // 			return v / rndTotal;
      // 		}),
      // 		min
      // 	);

      // 	function validateAndCorrectProportions(
      // 		proportions: any[],
      // 		min: number
      // 	): number[] {
      // 		var sortedProportions = proportions.sort(function (a, b) {
      // 			return a - b;
      // 		});

      // 		for (var i = 0; i < sortedProportions.length; i += 1) {
      // 			if (sortedProportions[i] < min) {
      // 				var diff = min - sortedProportions[i];
      // 				sortedProportions[i] += diff;
      // 				sortedProportions[sortedProportions.length - 1] -= diff;
      // 				return validateAndCorrectProportions(sortedProportions, min);
      // 			}
      // 		}

      // 		return sortedProportions;
      // 	}
      // }

      /*
       * Array sorting algorithm
       */
      function knuthfisheryates2(arr: string[] | any[]) {
        var temp,
          j,
          i = arr.length;
        while (--i) {
          j = ~~(Math.random() * (i + 1));
          temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }

        return arr;
      }
    }
    return () => {
      setNewPie(null);
    };
    //numChartUpdates.current.push(numChartUpdates.current.length); //make a new element to put a canvas in
  }, [groceriesCocktails, groceriesWines, groceriesBeers]);
  //console.log("useEffect stateRightToMakeChanges: ", stateRightToMakeChanges);
  return (
    <>
      <canvas
        id="piechart"
        ref={canvasRef}
        onClick={() => {
          dispatch(setRightToMakeChanges("CHART"));
        }}
      >
        Your browser is too old!
      </canvas>
      <table id="proportions-table" style={{ opacity: "0" }}></table>
    </>
  );
};

DraggablePieChart.propTypes = {};

export default DraggablePieChart;
