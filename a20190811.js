/*
 * @name Flocking
 * @description Demonstration of <a href="http://www.red3d.com/cwr/">Craig Reynolds' "Flocking" behavior</a>.<br>
 * (Rules: Cohesion, Separation, Alignment.)<br>
 * From <a href="http://natureofcode.com">natureofcode.com</a>.
 **Line 128 129 change velocity
 */

let boids = [];
let r =6;
const Y_AXIS = 1;
const X_AXIS = 2;  
let b1, b2;
let img;
var song;
let colormodel = 1.1;
function preload() {
  song = loadSound('data/bgm.mp3');
}

function setup() {
  createCanvas(1920, 1080);
  // Add an initial set of boids into the system
  for (let i = 0; i < 350; i++) {
    boids[i] = new Boid(random(width), random(height));
  }
  img = loadImage('data/button.png');
   song.loop();
   colormodel = random(1, 9);
    
}
let c=250;


function draw() {
  colorshow();
  if ( !song.isPlaying() ) { 
   song.play();
  }
  setGradient(0, 0, width, height, b1, b2, X_AXIS);
  // Run all the boids
  fill(0);
  for (let i = 0; i < c; i++) {
    boids[i].run(boids);
  }

  image(img, 1660, 980,230,60);

}

function mouseClicked(){
   if(mouseX>1660&&mouseX<1660+230&&mouseY>980&&mouseY<980+80){
         chengcolor();
   }
}


function  mouseDragged() {

  if (c<600) {
    boids[c++]=new Boid(mouseX, mouseY);
    boids[c++]=new Boid(mouseX, mouseY);
    boids[c++]=new Boid(mouseX, mouseY);
    boids[c++]=new Boid(mouseX, mouseY);
    boids[c++]=new Boid(mouseX, mouseY);
  }

} 

function chengcolor() {
  colormodel = random(1, 9);
  
}
function colorshow() {

    if (colormodel>8) {
    b1 = color(241,40,17);
    b2 = color(245,172,25);
  } else if (colormodel>7) {
    b1 = color(168,76,108);
    b2 = color(61,140,152);
  } else if (colormodel>6) {
    b1 = color(21,192,233);
    b2 = color(244,79,93);
  } else if (colormodel>5) {
    b1 = color(142,45,226);
    b2 = color(75,1,224);
  } else if (colormodel>4) {
    b1 = color(161, 201, 179);
    b2 = color(195, 108, 112);
  } else if (colormodel>3) {
    b1 = color(150, 49, 51);
    b2 = color(34, 90, 158);
  } else if (colormodel>2) {
    b1 = color(253, 1, 152);
    b2 = color(75, 49, 65);
  } else if (colormodel>1) {
    b1 = color(32, 66, 57);
    b2 = color(151,239,197);
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}


// Boid class
// Methods for Separation, Cohesion, Alignment added
class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = p5.Vector.random2D();
    this.position = createVector(x, y);
    this.r = 1.0;
    this.maxspeed = 15;    // Maximum speed
    this.maxforce = 0.9; // Maximum steering force
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  // Forces go into acceleration
  applyForce(force) {
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids);    // Alignment
    let coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(2.5);
    ali.mult(3.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  // Draw boid as a circle
  render() {
    fill(255);
    stroke(255);
  //  ellipse(this.position.x, this.position.y, 16, 16);

    // fill(127);
    //stroke(127);
    //  let  theta = random(0,90);

   let theta = this.velocity.heading() + radians(90);

    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape();
    pop();
    
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {

      if (boids[i].position!="undefined") {


        let d = p5.Vector.dist(this.position, boids[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
          // Calculate vector pointing away from neighbor
          let diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
          diff.div(d); // Weight by distance
          steer.add(diff);
          count++; // Keep track of how many
        }
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
}

/*
  *Please make sure you have 
  Processing and p5.js mode installed.
  *Please open with Chrome. 
  *Thx and Enjoy.
*/
