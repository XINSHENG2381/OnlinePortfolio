let planets=[];
let earth;
let hero;
let blackhole1;
let blackhole2;
let G=5;

function setup() {
  createCanvas(1000,550);
  background(0);
  let iniHeroPosX=random(width/3,2*width/3);
  let iniHeroPosY=random(50,100);
  hero=new Hero(iniHeroPosX,iniHeroPosY,0.5);
  earth=new Attractor(width/2,height,150,0,0,139);
  let x1=random(width);
  let x2=random(height);
  blackhole1=new Blackhole(x1,x2,50);
  blackhole2=new Blackhole(width-x1,height-x2,50);
  
  for(i=0;i<6;i++){
    planets[i]=new Attractor(random(width),random(50,height),random(10,60),random(0,255),random(0,255),random(0,255)); 
  } 
}

function draw() {
  background(0,5);
  //background(0);
  // extraCanvas.fill(255);
  //   let xx=random(width);
  //   let yy=random(height);
  //   extraCanvas.ellipse(xx,yy,1,1);

  earth.display();
  earth.attract(hero);
  for(let planet of planets){
    planet.display();
    planet.attract(hero);
  }
  blackhole1.display();
  blackhole2.display();


 // get rid of attraction
 if (keyIsPressed === true) {
    hero.noattraction();
    textStyle(BOLD);
    fill(255);
    textSize(22);
    text("ANTI-GRAVITY ON",80,100);
  } else {
    ;
  }
  
 

  //tranfered by blackholes
  if(hero.intersects(blackhole1)){
    hero.pos.x=width-hero.pos.x;
    hero.pos.y=height-hero.pos.y;
  }else{
    hero.pos.x=hero.pos.x;
    hero.pos.y=hero.pos.y;
  }
    if(hero.intersects(blackhole2)){
    hero.pos.x=width-hero.pos.x;
    hero.pos.y=height-hero.pos.y;
  }else{
    hero.pos.x=hero.pos.x;
    hero.pos.y=hero.pos.y;
  }

  //starry background
  for(i=0;i<2;i++){
    noStroke();
    fill(random(255),random(255),random(255),200);
    ellipse(random(width),random(height),2,2);

  }

  //particle storm
  for(i=0;i<3;i++){
    fill(255);
    ellipse(random(width),random(300,400),3,3);
  }
  if(hero.pos.y>300&&hero.pos.y<400){
    let randomforce=p5.Vector.random2D().mult(random(9));
    hero.applyForce(randomforce);
    textSize(22);
    textStyle(BOLD);
    fill(255,0,0);
    text("WARNING: PARTICLE STORM",80,550);
  }


  // crash onto other planet
  let overlapping=false;
  for(let planet of planets){
      if(hero.intersects(planet)){
        overlapping=true;
      }
    }
  if(overlapping){
    background(255,50);
    hero.stop();
    textSize(70);
    textAlign(CENTER);
    text("GAME OVER",width/2,height/2);
  }
  else{

  //landing on the Earth
  if(hero.intersects(earth)){
    background(255,215,0,50);
    hero.stop();
    textSize(70);
    textAlign(CENTER);
    text("WELCOME HOME!",width/2,height/2);
  }
  }

  hero.show();
  hero.update();
  hero.velArrow();
  hero.accArrow();
  
}
// function mousePressed(){
// hero.pos.x=iniHeroPosX;
// hero.pos.y=iniHeroPosY;
// }
// function mouseReleased() {
// hero.pos.x=hero.pos.x;
// hero.pos.y=hero.pos.y;
// }

// function mouseIsPressed(){
//   hero.pos.x=iniHeroPosX;
//   hero.pos.y=iniHeroPosY;
// }





class Attractor{
constructor(_x,_y,_m,_Red,_Green,_Blue){
  this.pos=createVector(_x,_y);
  this.mass=_m;
  this.r=sqrt(this.mass)*10;
  this.R=_Red;
  this.G=_Green;
  this.B=_Blue;

}
display(){
  noStroke();
  fill(this.R,this.G,this.B);
  ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
}
attract(mover){
  let force=p5.Vector.sub(this.pos,mover.pos);
  let distanceSQ=constrain(force.magSq(),1000,3500);
  //let distanceSQ=force.magSq();
  //let G=8;
  let strength=G*this.mass*mover.mass/distanceSQ; 
  force.setMag(strength);
  mover.applyForce(force);
}

}//end of class attractor


class Hero{
constructor(_x,_y,_m){
  this.pos =createVector(_x,_y);
  //this.vel=createVector(random(0,4),random(0,4));
  this.vel=p5.Vector.random2D().mult(3);
  this.acc=createVector(0,0);
  this.mass=_m;
  this.r=sqrt(this.mass)*10;
  // this.acc=p5.Vector.random2D();
  // this.acc.setMag(0.5);
  this.poscopy=this.pos.copy();//copy the vector of position



}
applyForce(force){
  let f=p5.Vector.div(force,this.mass);
  this.acc.add(f);
  this.acccopy=this.acc.copy();// copy the vector of acc
}

update(){
  // let mouse=createVector(mouseX,mouseY);
  // this.acc=p5.Vector.sub(mouse, this.pos);
  // this.acc.setMag(1);

  this.vel.add(this.acc);
  this.vel.limit(1);
  this.pos.add(this.vel);
  this.acc.set(0,0);
}
show(){
  stroke(255);
  strokeWeight(4);
  noFill();
  ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
} 

intersects(other){
    let d=dist(this.pos.x,this.pos.y,other.pos.x,other.pos.y);
    return (d<this.r+other.r);
  }


stop(){
  this.vel.set(0,0);
  this.acc.set(0,0);
}
noattraction(){
  this.acc.set(0,0);

}

velArrow(){
  // let e=this.vel.normalize();
  // e.setMag(30);
  let velo=this.vel.mult(30);
  stroke(0,255,0);
  strokeWeight(2);
  translate(this.pos.x,this.pos.y);
  line(0,0,this.vel.x,this.vel.y);
}

accArrow(){
  let e=this.acccopy.normalize();
  e.setMag(30);
  stroke(255,0,0);
  strokeWeight(2);
  line(0,0,e.x,e.y);
}

}//end of class walker

class Blackhole{
  constructor(_x,_y,_m){
    this.pos=createVector(_x,_y);
    this.mass=_m;
    this.r=50; //height
    this.w=100; // weight
  }
  display(){
    stroke(210,105,30,50);
    strokeWeight(10);
    noFill();
    ellipse(this.pos.x,this.pos.y,this.w,this.r);
    noStroke();
  }

}// end of class blackhole