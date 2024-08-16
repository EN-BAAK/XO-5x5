//!     Template Functions
//  Create Element
const bCreateElement = function (element, className, id, text) {
    var newElement = document.createElement(element);
    className !== null ? (newElement.className = className) : null;
    id !== null ? (newElement.id = id) : null;
    if (text !== null) {
        newElement.appendChild(document.createTextNode(text));
    }

    return newElement;
};
//!     Variables
//  To Know Which Player Will Play
let turnOfFirstPlayer = false,
    //  Get The Data From Local Storage
    dataGameList = JSON.parse(window.localStorage.getItem("XOGameData")),
    chellangeVS = dataGameList.VS,
    //  Select The HTML Element
    body = document.querySelector(".index"),
    endingLayout = document.querySelector(".index .ending-layout"),
    playerArea = document.querySelector(".players-area"),
    grid = document.querySelectorAll(".game-area .grid .column"),
    //  Set Colors
    greenColor = "#0D0",
    redColor = "#D00",
    //  Get  The root Element From CSS
    mainCss = document.querySelector(":root"),
    root = getComputedStyle(mainCss),
    //  Get The Variables Of Players Color
    PlayerOneColor = root.getPropertyValue("--c-first-player"),
    playerTwoColor = root.getPropertyValue("--c-second-player"),
    //  Main Classes
    classFirstPlayer = "player-one-turn",
    //  Complete Checker Variable
    checkCompleteLine = false,
    //  The Gender Variable
    gender = "O";
//  Set The Players Name And The Chellange Type(vs Bot/ Other Player)
document.getElementById("player-one").innerHTML = dataGameList.playerOneName;
document.getElementById("player-two").innerHTML = dataGameList.playerTwoName;

//!     Main
//  Check If The Player2 Is Bot
//  Let It To Play First
if (bot()) {
    //  Get A Random Number Between 0 And 24
    var randomCell = Math.floor(Math.random() * 25);
    //  Click On The Random Cell
    grid[randomCell].click();
    botClicked(grid[randomCell]);
    //  Swap The Turn Of Players
}
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("column")) {
        //  Let The Choocen Cell Clicked
        e.target.setAttribute("clicked", "true");
        //  Draw The Shap Of Player
        turnOfFirstPlayer ? drawO(e.target) : drawX(e.target);
        //  Switch The Player Turn
        switchPlayer();
        //  Detect The Gender To Check The Complete
        gender = turnOfFirstPlayer ? "O" : "X";
        checkComplete(gender) ? endGame() : null;
        //  Converse The Playre One Turn Checking
        turnOfFirstPlayer = !turnOfFirstPlayer;
        //  Check If The Bot Is The Player2 And If It's Its Turn
        if (bot() && !turnOfFirstPlayer) {
            //  Set The Points Of Empty Cells
            setPoints("X", "O");
            //  Define The Array Of Empty Cells To Operate The Algorithm
            var emptyCells = document.querySelectorAll(
                    '.column[gender="empty"]'
                ),
                //  To Detect Wich Operation Will Start First In The Algorithm (Min/ Max)
                operation =
                    Math.floor(Math.log2(emptyCells.length)) % 2 == 0
                        ? true
                        : false,
                //  Set The Points In Array
                arrayOfPoints = getPoints(emptyCells);
            //  Check If ALl Points Is Same
            if (checkSamePoints(arrayOfPoints)) {
                //  To Let The Bot Know Wich Cell It Will Choose
                var cellIndex = getRandomCell();
                console.log(cellIndex);
                cellIndex.addEventListener("click", botClicked(cellIndex));
            } else {
                //  To Let The Bot Know Wich Cell It Will Choose
                var cost = alphaBetaSearch(arrayOfPoints, operation);
                cellIndex = searchCell(cost);
                console.log(cellIndex, "moz");
                cellIndex.addEventListener("click", botClicked(cellIndex));
            }
            checkComplete(gender) ? endGame() : null;
        }
    }
});

//!     Functions
//  Draw O Shape
function drawO(parent) {
    var o = bCreateElement("div", "o-shape", null, null);
    parent.appendChild(o);
    parent.setAttribute("gender", "O");
}
//  Draw X Shape
function drawX(parent) {
    var x = bCreateElement("div", "x-shape", null, null);
    var lineOne = bCreateElement("span", "line-one", null, null);
    var lineTwo = bCreateElement("span", "line-two", null, null);
    x.appendChild(lineOne);
    x.appendChild(lineTwo);
    parent.appendChild(x);
    parent.setAttribute("gender", "X");
}
//  Switch The Turn Of Players
function switchPlayer() {
    body.classList.toggle(`${classFirstPlayer}`);
    playerArea.classList.toggle(`${classFirstPlayer}`);
}
//  Check Complete Line
function checkComplete(gender) {
    if (rowCompleted(gender)) {
        return true;
    }
    if (columnCompleted(gender)) {
        return true;
    }
    if (mainDiameterCompleted(gender)) {
        return true;
    }
    if (secondDiameterCompleted(gender)) {
        return true;
    }
    if (gridCompleted()) {
        return true;
    }
    return false;
}
//  Check If The Row Completed
function rowCompleted(gender) {
    var complete;
    for (var i = 0; i < 25; i += 5) {
        complete = true;
        innerLoop: for (var j = 0; j < 5; j++) {
            if (
                grid[i + j].getAttribute("clicked") == "false" ||
                grid[i + j].getAttribute("gender") !== `${gender}`
            ) {
                complete = false;
                break innerLoop;
            }
        }
        if (complete) {
            return true;
        }
    }
    return false;
}
//  Check If The Column Completed
function columnCompleted(gender) {
    var complete;
    for (var i = 0; i < 5; i++) {
        complete = true;
        innerLoop: for (var j = 0; j < 24; j += 5) {
            if (
                grid[i + j].getAttribute("clicked") == "false" ||
                grid[i + j].getAttribute("gender") !== `${gender}`
            ) {
                complete = false;
                break innerLoop;
            }
        }
        if (complete) {
            return true;
        }
    }
    return false;
}
//  Check If The Main Diameter Completed
function mainDiameterCompleted(gender) {
    for (var i = 0; i < 25; i += 6) {
        if (
            grid[i].getAttribute("clicked") == "false" ||
            grid[i].getAttribute("gender") !== `${gender}`
        ) {
            return false;
        }
    }
    console.log(`The Main Diameter Is Completed`);
    return true;
}
//  Check If The Second Diameter Completed
function secondDiameterCompleted(gender) {
    for (var i = 4; i <= 20; i += 4) {
        if (
            grid[i].getAttribute("clicked") == "false" ||
            grid[i].getAttribute("gender") !== `${gender}`
        ) {
            return false;
        }
    }
    console.log(`The Second Diameter Is Completed`);
    return true;
}
//  Check If All Cells Have Been Clicked
function gridCompleted() {
    var complete = true;
    for (var i = 0; i < 25; i++) {
        if (grid[i].getAttribute("gender") === "empty") {
            return false;
        }
    }
    return true;
}
//  Finish The Game
function endGame() {
    endingLayout.classList.add("show") / console.log("Join");
    window.localStorage.clear("XOGameData");
    setTimeout((_) => {
        location.href = `./index.html`;
    }, 3500);
}
//  Distribution The Points Of Cells
function setPoints(gender, xGender) {
    for (var i = 0; i < 25; i += 5) {
        for (var j = 0; j <= 4; j++) {
            var points = 0;
            if (grid[i + j].getAttribute("gender") === "empty") {
                //  set Points Of Rows Cells
                for (var k = 0; k <= 4; k++) {
                    grid[i + k].getAttribute("gender") === gender
                        ? points++
                        : grid[i + k].getAttribute("gender") === xGender
                        ? points--
                        : null;
                }
                //  Set Points Of Columns Cells
                for (var k = 0; k < 25; k += 5) {
                    grid[(j % 5) + k].getAttribute("gender") === gender
                        ? points++
                        : grid[(j % 5) + k].getAttribute("gender") === xGender
                        ? points--
                        : null;
                }
                //  Set Points Of Second Diameter Cells
                if (checkInSecondDiameter(i + j)) {
                    for (var k = 4; k < 24; k += 4) {
                        grid[k].getAttribute("gender") === gender
                            ? points++
                            : grid[k].getAttribute("gender") === xGender
                            ? points--
                            : null;
                    }
                }
                //  Set Points Of Main Diameter Cells
                if (checkInMainDiameter(i + j)) {
                    for (var k = 0; k <= 24; k += 6) {
                        grid[k].getAttribute("gender") === gender
                            ? points++
                            : grid[k].getAttribute("gender") === xGender
                            ? points--
                            : null;
                    }
                }
                points = points < 0 ? -points : points;
                grid[i + j].setAttribute("points", points);
            }
        }
    }
}
//  Check If The Element Is A Point In Main Diameter
function checkInSecondDiameter(index) {
    return index % 4 === 0 && index !== 24 && index != 0 ? true : false;
}
function checkInMainDiameter(index) {
    return index % 6 === 0 ? true : false;
}
//  Get Points
function getPoints(arr) {
    let newArr = [];
    arr.forEach((e) => {
        newArr.push(+e.getAttribute("points"));
    });
    return newArr;
}
//  Check If The Player2 Is A Bot
function bot() {
    return chellangeVS === "bot" ? true : false;
}
//  Handle The Click Of Bot
function botClicked(e) {
    console.log('start')
    //  Let The Choocen Cell Clicked
    e.setAttribute("clicked", "true");
    //  Draw The X
    drawX(e);
    //  Switch The Player Turn
    switchPlayer();
    turnOfFirstPlayer = !turnOfFirstPlayer;
}
//  Search About Cell
function searchCell(cost) {
    var element;
    for (var e of grid) {
        if (e.getAttribute("gender") == "empty") {
            if (+e.getAttribute("points") == cost) {
                element = e;
                break;
            }
        }
    }
    return element;
}
//  Check If All Points Are Same
function checkSamePoints(arr) {
    var cost = document.querySelector('[gender="empty"]').getAttribute('points');
    console.log(cost)
    for(var i =0 ; i<arr.length; i++) {
        if(arr[i] !=cost) {
            return false
        }
    }
    return true
}
//  Get Random Cell
function getRandomCell() {
    var randomCell = Math.floor(Math.random() * 25);
    console.log(randomCell)
    return grid[randomCell].getAttribute("gender") == "empty"
        ? grid[randomCell]
        : getRandomCell();
}
//!     AlphaBeta Algorithm
//  The Main Method Of AlphaBeta Algorithm
//  Operation Arguments To Know If The Operation In The Case Is Min Or Max
function alphaBetaSearch(arr, operation) {
    while (arr.length != 1) {
        arr = operation ? betaOperation(arr) : alphaOperation(arr);
        operation = !operation;
    }
    return arr[0];
}
//  To Get The Min Values In The Arr
function betaOperation(arr) {
    let newArray = [];
    while (arr.length != 0) {
        var x1 = arr.shift();
        var x2 = arr.shift();
        if (x2 !== undefined) {
            var minValue = Math.min(x1, x2);
            newArray.push(minValue);
        } else {
            newArray.push(x1);
        }
    }
    return newArray;
}
//  To Get The Max Values In The Arr
function alphaOperation(arr) {
    let newArray = [];
    while (arr.length != 0) {
        var x1 = arr.shift();
        var x2 = arr.shift();
        if (x2 !== undefined) {
            var minValue = Math.max(x1, x2);
            newArray.push(minValue);
        } else {
            newArray.push(x1);
        }
    }
    return newArray;
}
