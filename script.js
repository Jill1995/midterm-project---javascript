//DECLARING ALL GLOBAL VARIABLES

var c;
var lineModuleSize = 0;
var angle = 0;
var angleSpeed = 1;
var lineModule = [];
var lineModuleIndex = 0;

var clickPosX = 0;
var clickPosY = 0;

var col1, col2, col3, col4, col5;
var color1, color2, color3, color4, color5;
var scheme = [];

//LOADER - GRAPHIC UNTIL API IS FETCHING RESULTS
const spinner = document.getElementById("spinner");

function showSpinner() {
  spinner.className = "show";
  setTimeout(() => {
    spinner.className = spinner.className.replace("show", "");
  }, 10000);
}
function hideSpinner() {
  spinner.className = spinner.className.replace("show", "");
}
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

  // console.log(col1, col2, col3, col4, col5);
  //FETCHING API
  showSpinner();
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
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(resp) {
      hideSpinner();
      //console.log(resp);
      //CHANGING BUTTON NAME AFTER CLICKED ONCE TO TOGGLE SCHEMES
      document.getElementById("scheme").value = "Toggle Palletes";
      colorScheme(resp);
    })

    .catch(function(error) {
      console.log("error is there");
    });

  event.preventDefault();
}

//CREATING A COLOR PALETTE FROM THE DATA RECIEVED
function colorScheme(data) {
  scheme.length = 0;
  var sch = Math.floor(Math.random(0, 1) * 20);
  for (var i = 0; i < 5; i++) {
    scheme.push(data.schemes[sch].colors[i]);
  }
  color1 = "#" + scheme[0];
  color2 = "#" + scheme[1];
  color3 = "#" + scheme[2];
  color4 = "#" + scheme[3];
  color5 = "#" + scheme[4];

  //SETTING COLOR OF DIVS TO THE PALETTE COLORS
  document.getElementById("col1").style.backgroundColor = color1;
  document.getElementById("col2").style.backgroundColor = color2;
  document.getElementById("col3").style.backgroundColor = color3;
  document.getElementById("col4").style.backgroundColor = color4;
  document.getElementById("col5").style.backgroundColor = color5;

  console.log(scheme);
}

//p5.js CANVAS SETUP
function setup() {
  var myCanvas = createCanvas(1090, 700);
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
    var x = mouseX;
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

// SELECTING COLOR FROM THE PALLETE DIVS AND
//SETTING THE COLOR OF LINES THAT ARE BEING DRAWN
document.getElementById("col1").addEventListener("click", function() {
  c = color1;
});
document.getElementById("col2").addEventListener("click", function() {
  c = color2;
});
document.getElementById("col3").addEventListener("click", function() {
  c = color3;
});
document.getElementById("col4").addEventListener("click", function() {
  c = color4;
});
document.getElementById("col5").addEventListener("click", function() {
  c = color5;
});

//SELECTING PREFERRED BRUSH SHAPE BY CLICKING DIV ICONS
document.getElementById("brush1").addEventListener("click", function() {
  lineModuleIndex = 0;
});
document.getElementById("brush2").addEventListener("click", function() {
  lineModuleIndex = 1;
});
document.getElementById("brush3").addEventListener("click", function() {
  lineModuleIndex = 3;
});
document.getElementById("brush4").addEventListener("click", function() {
  lineModuleIndex = 4;
});

//SAVING THE ARTWORK AS PNG ON BUTTON CLICK
document.getElementById("save").addEventListener("click", function() {
  saveCanvas(canvas, "mydrawing", "png");
});

//CONVERTING NAMES TO CORRESPONDING HEX CODE
var el_up = document.getElementById("GFG_UP");
//convert color name to hex code
function convert(rgb) {
  rgb = rgb.match(/^rgb\((\d+), \s*(\d+), \s*(\d+)\)$/);
  function hexCode(i) {
    return ("0" + parseInt(i).toString(16)).slice(-2);
  }
  return hexCode(rgb[1]) + hexCode(rgb[2]) + hexCode(rgb[3]);
}
//getting the color in rgb format and convert to hex
function gfg_Run(color) {
  el_up.style.color = color;

  var rgb = window.getComputedStyle(el_up).color;
  return convert(rgb).toString();
}
