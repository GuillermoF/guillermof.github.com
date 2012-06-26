window.onload = function(){
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
drawGrid(canvas, ctx);

var StartEnd_Button = document.getElementById('generateStartEnd');
StartEnd_Button.onclick = function() {
var grid;
var temp;
temp = redraw(); //redraw returns [start(x,y), end(x,y)]
var start = temp[0]; //start point: [x,y]
var end = temp[1]; //end point: [x,y]
var Obstacles_Button = document.getElementById('generateObstacles');
Obstacles_Button.onclick = function() {
var obstacles = regen_obstacles(start, end);
var Path_Button = document.getElementById('makePath');
Path_Button.onclick = function() {
grid = make_grid(obstacles);
var astar_grid = make_astar(end);
make_path(start, end, grid, astar_grid);
}
}
var PathButtonNoObstacles = document.getElementById('makePath');
PathButtonNoObstacles.onclick = function() {
grid = make_grid();
var astar_grid = make_astar(end);
make_path(start, end, grid, astar_grid);
}
};
}

function redraw() {
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

canvas.width = canvas.width;
drawGrid(canvas, ctx);
var coords;
coords = start_finish();
return coords;
}

function regen_obstacles(start, end) {
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var obs;
ctx.clearRect(0,0, canvas.width, canvas.height);
drawGrid(canvas, ctx);
set_bgcolor(start[0], start[1], 'start');
set_bgcolor(end[0], end[1], 'end');
obs = gen_obstacles(start, end);
return obs;
}

function drawGrid(canvas, ctx) {
for (var i=0; i < canvas.width ; i += 20) {
ctx.moveTo(i, 0);
ctx.lineTo(i, canvas.height);
ctx.stroke();
ctx.moveTo(0, i);
ctx.lineTo(canvas.width, i);
ctx.stroke();
};
}

function start_finish() {
var x,y;
x = rand_num(x, 400); //generate random start x,y coord
y = rand_num(y, 200);
start = set_bgcolor(x,y, 'start');  //set point bg color
x = rand_num(x, 400); //random x,y for end point
y = rand_num(y, 200);
end = set_bgcolor(x,y, 'end');      //set end point bg color
return [start, end];
}

function rand_num(coord, num) {
coord = Math.floor(Math.random() * num);
return coord;
}

function set_bgcolor(x, y, point) {
x -= x % 20;
y -= y % 20; //"sanitize" x,y point to fit relative to the grid
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
switch(point){
case 'start':
ctx.fillStyle = 'green';
ctx.fillRect(x,y,20,20);
break;
case 'end':
ctx.fillStyle = 'red';
ctx.fillRect(x,y,20,20);
break;
case 'obstacle':
ctx.fillStyle = 'black';
ctx.fillRect(x,y,20,20);
break;
case 'path':
ctx.moveTo(x+10,y+10);
ctx.fillStyle = 'lightblue';
ctx.arc(x+10,y+10,5,0,2*Math.PI);
ctx.stroke();ctx.fill();
}
return [x,y];
}

function gen_obstacles(start, end){
var num       = rand_num(num, 50); //generate up to 50 obstacles
var obstacles = [];
var x,y;
for (var i=0; i < num; i++){
do{
x = rand_num(x, 400);
y = rand_num(y, 200);
x -= x % 20;
y -= y % 20;
}while(x == start[0] && y == start[1] || x == end[0] && y == end[1]);
set_bgcolor(x,y, 'obstacle');
obstacles.push([x,y]);
}
return obstacles;
}

function make_grid(obstacles) {
var grid = [];
var x,y;
for (i=0; i < canvas.width; i++) {
grid.push([]);
for (j=0; j < canvas.height; j++)
grid[i].push(0); //populate the grid so 0's mean an open cell
}
if (arguments.length == 1) {
for (k=0; k < obstacles.length; k++){
x = obstacles[k][0] / 20;
y = obstacles[k][1] / 20;
grid[x][y] = 1; //set obstacle cells to 1
}
}
return grid;
}

function make_astar(end) {
var ex = end[0] / 20;
var ey = end[1] / 20;
var x_dist, y_dist, t_dist;
var astar_grid = [];
for (i=0; i < canvas.width; i++) {
astar_grid.push([]);
for (j=0; j < canvas.height; j++) {
x_dist = Math.abs(ex - i);
y_dist = Math.abs(ey - j);
t_dist = x_dist + y_dist;
astar_grid[i].push(t_dist);
}
}
return astar_grid;
}

function make_path(start, end, grid, astar_grid) {
var newx, newy, g;
var compare = []; //serves to compare what cell is best to travel to
var moves   = [[1, 0], //move right
      [0, 1], //down
      [-1,0], //left
      [0,-1]]; //up
goalx = end[0] / 20;
goaly = end[1] / 20;
var values = [];
actions = [];
for (i = 0; i < grid[0].length; i++) {
values[i] = new Array(canvas.height);
actions[i] = new Array(canvas.height);
for (j = 0; j < grid.length; j++) {
values[i][j] = 99;
actions[i][j] = -1;
}
}
change = true;

while (change) {
change = false;
for (x = 0; x < grid[0].length; x++) {
for (y = 0; y < grid.length; y++) {
if (x == goalx && y == goaly) {
if (values[x][y] > 0){
values[x][y] = 0;
change = true;
}
}
else if (!grid[x][y]) {
for (i = 0; i < moves.length; i++) {
x2 = x + moves[i][0];
y2 = y + moves[i][1];
if (x2 >= 0 && y2 >= 0 && x2 < canvas.width / 20 && y2 < canvas.height / 20) {
v2 = values[x2][y2] + 1;
if (v2 < values[x][y]) {
change = true;
values[x][y] = v2;
actions[x][y] = i;
}
}
}
}
}
}
}

x = start[0] / 20; y = start[1] / 20;
while (Math.abs(goalx - x) > 1 || Math.abs(goaly - y) > 1) {
x += moves[actions[x][y]][0];
y += moves[actions[x][y]][1];
xpath = x*20;
ypath = y*20
set_bgcolor(xpath,ypath,'path');
}
}
