//DECLARING ALL GLOBAL VARIABLES

let c;
let lineModuleSize = 0;
let angle = 0;
let angleSpeed = 1;
let lineModule = [];
let lineModuleIndex = 0;

let clickPosX = 0;
let clickPosY = 0;

let col1, col2, col3, col4, col5;

let scheme = [];

//LOADER - GRAPHIC UNTIL API IS FETCHING RESULTS

const Spinner = {
  start: function () {
    const spin = document.getElementById("spinner");
    spin.className = "show";
    setTimeout(() => {
      spin.className = spin.className.replace("show", "");
    }, 10000);
  },
  stop: function () {
    const spin = document.getElementById("spinner");
    spin.className = spin.className.replace("show", "");
  },
};

//PRELOADING BRUSHES FROM SVG IMAGES
function preload() {
  lineModule[1] = loadImage("data/02.svg");
  lineModule[2] = loadImage("data/03.svg");
  lineModule[3] = loadImage("data/04.svg");
  lineModule[4] = loadImage("data/05.svg");
}

//CALLING FOR PALETTES BY SUBMITTING FORM
document.getElementById("colors").addEventListener("submit", getColors);

//CALLBACK FUNCTION TO FETCH API
function getColors() {
  //CONVERTING USER INPUT COLOR NAMES TO RESPECTIVE HEX VALUE
  col1 = gfg_Run(document.getElementById("color1").value);
  col2 = gfg_Run(document.getElementById("color2").value);
  col3 = gfg_Run(document.getElementById("color3").value);
  col4 = gfg_Run(document.getElementById("color4").value);
  col5 = gfg_Run(document.getElementById("color5").value);

  const elements = document.getElementById("colors").elements;

  for (let i = 0, element; (element = elements[i++]); ) {
    if (element.type === "text" && element.value === "") element.value = "red";
  }

  //FETCHING API
  Spinner.start();

  let url =
    "http://www.colr.org/json/search_by_colors?colors=" +
    col1 +
    "," +
    col2 +
    "," +
    col3 +
    "," +
    col4 +
    "," +
    col5;
  // console.log(url);
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      Spinner.stop();
      //console.log(resp);
      //CHANGING BUTTON NAME AFTER CLICKED ONCE TO TOGGLE SCHEMES
      document.getElementById("scheme").value = "Toggle Palletes";
      colorScheme(resp);
    })

    .catch(function (error) {
      console.log("error is there");
    });

  event.preventDefault();
}

//CREATING A COLOR PALETTE FROM THE DATA RECIEVED
function colorScheme(data) {
  scheme.length = 0;
  let sch = Math.floor(Math.random(0, 1) * 20);
  for (var i = 0; i < 5; i++) {
    scheme.push(data.schemes[sch].colors[i]);
  }

  //SETTING COLOR OF DIVS TO THE PALETTE COLORS TO SELECT PAINT
  document.getElementById("col1").style.backgroundColor = "#" + scheme[0];
  document.getElementById("col2").style.backgroundColor = "#" + scheme[1];
  document.getElementById("col3").style.backgroundColor = "#" + scheme[2];
  document.getElementById("col4").style.backgroundColor = "#" + scheme[3];
  document.getElementById("col5").style.backgroundColor = "#" + scheme[4];

  console.log(scheme);
}

//p5.js CANVAS SETUP
function setup() {
  let myCanvas = createCanvas(1090, 700);
  myCanvas.parent("canvas");
  cursor(CROSS);
  strokeWeight(0.75);
  background(0);
  c = color(255);
  textSize(13);
  fill(255);
  text(
    "Left click and drag mouse to draw; Hit delete/backspace to clear canvas.",
    670,
    690
  );
}

//DRAWING BY USERS
function draw() {
  if (mouseIsPressed && mouseButton == LEFT) {
    let x = mouseX;
    var y = mouseY;
    if (keyIsPressed && keyCode == SHIFT) {
      if (abs(clickPosX - x) > abs(clickPosY - y)) {
        y = clickPosY;
      } else {
        x = clickPosX;
      }
    }

    push();
    translate(x, y);
    rotate(radians(angle));
    if (lineModuleIndex != 0) {
      tint(c);
      image(lineModule[lineModuleIndex], 0, 0, lineModuleSize, lineModuleSize);
    } else {
      stroke(c);
      line(0, 0, lineModuleSize, lineModuleSize);
    }
    angle += angleSpeed;
    pop();
  }
}

//GIVING RANDOM VALUES TO SIZE OF BRUSH
function mousePressed() {
  lineModuleSize = random(50, 160);

  clickPosX = mouseX;
  clickPosY = mouseY;
}

//CHANGING BRUSH SIZES AND ROTATION SPEED
function keyPressed() {
  if (keyCode == UP_ARROW) lineModuleSize += 5;
  if (keyCode == DOWN_ARROW) lineModuleSize -= 5;
  if (keyCode == LEFT_ARROW) angleSpeed -= 0.5;
  if (keyCode == RIGHT_ARROW) angleSpeed += 0.5;
}

//CLEARING CANVAS
function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    background(0);
    textSize(13);
    fill(255);
    text(
      "Left click and drag mouse to draw; Hit delete/backspace to clear canvas.",
      670,
      690
    );
  }

  // reverse direction and mirror angle
  if (key == "d" || key == "D") {
    angle += 180;
    angleSpeed *= -1;
  }
}

// SELECTING COLOR OF BRUSH
//SELECTING PREFERRED BRUSH SHAPE BY CLICKING DIV ICONS
document.addEventListener("click", function (e) {
  if (e.target.className == "prefColor") {
    c = e.target.style.backgroundColor;
  }

  if (e.target.className == "bru") {
    if (e.target.id == "brush1") {
      lineModuleIndex = 0;
    }
    if (e.target.id == "brush2") {
      lineModuleIndex = 1;
    }
    if (e.target.id == "brush3") {
      lineModuleIndex = 2;
    }
    if (e.target.id == "brush4") {
      lineModuleIndex = 3;
    }
  }
});

//SAVING THE ARTWORK AS PNG ON BUTTON CLICK
document.getElementById("saveImage").addEventListener("click", function () {
  saveCanvas(canvas, "mydrawing", "png");
});

//getting the color in rgb format and convert to hex
function gfg_Run(color) {
  var el_up = document.createElement("p");
  el_up.style.color = color;
  var element = document.getElementById("textinput");
  element.appendChild(el_up);

  var rgb = window.getComputedStyle(el_up).color;

  const convert = function (rgb) {
    rgb = rgb.match(/^rgb\((\d+), \s*(\d+), \s*(\d+)\)$/);
    function hexCode(i) {
      return ("0" + parseInt(i).toString(16)).slice(-2);
    }
    return hexCode(rgb[1]) + hexCode(rgb[2]) + hexCode(rgb[3]);
  };
  return convert(rgb).toString();
}
