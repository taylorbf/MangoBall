/************************
* Javascript Mango Game *
* @uthor Ben Taylor     *
************************/

				
function mango(target, transmitCommand, uiIndex) {
					
	//self awareness
	var self = this;
	if (!isNaN(uiIndex)) {
		self.uiIndex = uiIndex;
	}
	this.defaultSize = { width: 300, height: 570 };
	
	//get common attributes and methods
	this.getTemplate = getTemplate;
	this.getTemplate(self, target, transmitCommand);
	
	this.CurrentBalls = new Array();
	this.CurrentBlocks = new Array();
	
	var ballPos = new Object();
	
	var globalMetro;
	var tempo = 1;
	var tempoMarker = 150;
	var quantize = false;
	var tilt = 0;
	
	var gravity = 0.1; // 0.1
//	var bounceLoss = -0.7;
	var bounceLoss = -1.052;
	var framerate = 60;
	var slingAffect = 10; //8 -- lower number means more speed
	var ballsize = 5; // 7
	var slingSize = 4;
	var slingThickness = ballsize;
	
	var clickChange = 0.08;
	this.clickedR = false;
	this.clickedL = false;
	
	this.bgReady = false;
	this.bgimg = null;
	
	this.skins = [
					{ one: "#fff",
					  two: "#fff" 
					}
	]
	
	this.level = 0;
	this.allLayouts = [
							{
								start: { x: 50, y: 220 },
								walls: [
									{ x: 80,  y: 220, width: 370, height: 10, type: "land" }
								],
								hole: [
									{ x: 480,  y: 220, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 50, y: 220 },
								walls: [
									{ x: 80,  y: 220, width: 370, height: 10, type: "land" }
								],
								hole: [
									{ x: 480,  y: 220, width: 30, height: 30, type: "hole" }
								]
							}
	]
	this.layout = this.allLayouts[self.level];
	
	
	this.bgSrcs = [
					"Whole.jpg",
					"SimplisticComplexity.jpg",
					"Sherbert.jpg",
					"Quark.jpg",
					"Gatorade.jpg",
					"kaleid2.png"
	
	]
	this.bgImgs = new Array();
    
    /** Initialize Object **/
	
	this.make = function() {
	
		for (i=0;i<this.bgSrcs.length;i++) {
			self.bgImgs[i] = new Image();
			self.bgImgs[i].src = "images/"+this.bgSrcs[i];
	 	}
		
		this.bgimg = new Image();
		this.bgimg.onload = function() {
			self.bgReady = true;
		};
		this.bgimg.src = "images/space.jpg";
		
		this.moon = new Image();
		this.moon.onload = function() {
			self.moonReady = true;
		};
		this.moon.src = "images/moon.png";
		
		this.addNewMB({"x": self.layout.start.x, "y": self.layout.start.y});
		
		this.createLevel();
		
		globalMetro = setInterval(this.canvasID+".pulse()", ~~(1000/framerate));
		
	}
	
	this.reset = function() {
		
		if (this.CurrentBlocks.length==0) {
			this.level++;
			self.bgimg = self.bgImgs[dream(self.bgImgs.length)];
		}
		
		this.createLevel();
		
		self.slinging = false;
		self.moving = false;
		self.won = false;
		
		self.layout = self.allLayouts[self.level];
		
		self.CurrentBalls[0].x = self.layout.start.x;
		self.CurrentBalls[0].y = self.layout.start.y;
		
		self.CurrentBalls[0].deltax = 0;
		self.CurrentBalls[0].deltay = 0;
		
		self.CurrentBalls[0].reInit();
	}
	
	this.createLevel = function() {
		this.CurrentBlocks = new Array();
		for (i=0;i<self.layout.walls.length;i++) {
			this.addNewBlock(this.layout.walls[i]);
		}
		this.createHole(this.layout.hole[0]);
		for (i=0;i<this.CurrentBlocks.length;i++) {
			this.CurrentBlocks[i].hit=false;
		}
		
	}
	
	this.createHole = function(holeData) {
		self.hole = {
			won: false,
			x: holeData.x,
			y: holeData.y,
			width: holeData.width,
			height: holeData.height,
		}
	}
	
	/** Animation Pulse **/
	
	this.pulse = function() {
		with (this.context) {
			clearRect(0,0, self.canvas.width, self.canvas.height);
		}
		this.drawSpaces();
		this.drawSling();
		this.drawBalls();
		this.drawBlocks();
		this.drawHole();
		
	}
	
	/** Draw framework of rounded rectangles **/
	
	this.drawSpaces = function() {
		
		with (this.context) {
			
			fillStyle = self.skins[0].three;
			
		//	fillRect(0,0,self.canvas.width,self.canvas.height);
			
			if (self.bgReady) {
				drawImage(self.bgimg, 0, 0, self.canvas.width, self.canvas.height);
			} 
			
		}
	}
	
	/** Draw functions **/
	
	this.drawBalls = function() {
			
			with (this.context) {
				if (self.moving) {
					self.CurrentBalls[0].move();
				}
				self.CurrentBalls[0].draw();
			}
			
		
	}
	
	this.drawBlocks = function() {
		with (this.context) {
			for (i=0;i<self.CurrentBlocks.length;i++) {
				self.CurrentBlocks[i].draw();
			}
		}
	}
	
	this.drawHole = function() {
	/*	with (this.context) {
			fillStyle = "#0af";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height);
			fillStyle = "#6cf";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height/1.5);
			fillStyle = "#eef";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height/3);
		}
	*/
	
		with (self.context) {
			globalAlpha = 0.8;
			
			//guide circle
			beginPath();
			strokeStyle = self.skins[0].two;
			lineWidth = slingThickness;
			arc(self.hole.x, self.hole.y, 15, 0, Math.PI*2, true);
			stroke();
			closePath();
			
			//guide inner circle
			beginPath();
			fillStyle = self.skins[0].one;
			arc(self.hole.x, self.hole.y, 5, 0, Math.PI*2, true);
			fill();
			closePath();
			
			globalAlpha = 1;
		}
	}
	
	/** Mouse functions **/
	this.click = function(e) {
		if (self.moving) {
			if (self.clickPos.x<self.canvas.width/2) {
				self.clickedR = true;
				self.clickedL = false;
			//	self.CurrentBalls[0].deltax -= clickChange;
			} else {
				self.clickedR = false;
				self.clickedL = true;
			//	self.CurrentBalls[0].deltax += clickChange;
			}
		} else {
			ballPos = self.clickPos;
			self.sling = new Object();
			self.sling.wid = self.CurrentBalls[0].radius * slingSize; 
			self.sling.hgt = self.CurrentBalls[0].radius * slingSize; 
			self.sling.x = self.CurrentBalls[0].x - self.CurrentBalls[0].radius; 
			self.sling.y = self.CurrentBalls[0].y - self.CurrentBalls[0].radius; 
			
			if (isInside(ballPos,self.sling)) {
				self.startSling();
			}
		}
	}
	
	this.move = function(e) {
		ballPos = self.clickPos;
		if (self.clicked && self.slinging) {
			self.moveSling(ballPos);
		}
		
	}
	
	this.release = function(e) {
		if (self.slinging) {
			self.startShot();
		}
		self.clickedR = false;
		self.clickedL = false;
				
		self.slinging = false;
	}
	
	this.touch = function(e) {
		self.click(e);
	}
	
	this.touchMove = function(e) {
		self.move(e);
	}
	
	this.touchRelease = function(e) {
		self.release(e);
	}
	
	/** Manage Sling **/
	
	this.slinging = false;
	this.slingPos = new Object();
	this.moving = false;
	
	this.startSling = function() {
		self.slinging = true;
	}
	
	this.moveSling = function(newPos) {
		self.CurrentBalls[0].x = newPos.x;
		self.CurrentBalls[0].y = newPos.y;
		
		self.CurrentBalls[0].deltax = (self.slingPos.x - newPos.x)/slingAffect;
		self.CurrentBalls[0].deltay = (self.slingPos.y - newPos.y)/slingAffect;
	}
	
	this.drawSling = function() {
		with (self.context) {
			globalAlpha = 0.8;
			
			//guide circle
			beginPath();
			strokeStyle = self.skins[0].two;
			lineWidth = slingThickness;
			arc(self.slingPos.x, self.slingPos.y, 15, 0, Math.PI*2, true);
			stroke();
			closePath();
			
			//guide inner circle
			beginPath();
			fillStyle = self.skins[0].one;
			arc(self.slingPos.x, self.slingPos.y, 5, 0, Math.PI*2, true);
			fill();
			closePath();
			
			if (self.slinging) {
				//tether
				beginPath();
				moveTo(self.slingPos.x, self.slingPos.y);
				lineTo(self.CurrentBalls[0].x, self.CurrentBalls[0].y);
				stroke();
				closePath();
			}
			
			globalAlpha = 1;
		}
	}
	
	this.startShot = function() {
		self.moving = true;
	}
	
	/** Manage Mangos **/
	
	this.deleteMB = function(ballPos) {
		//delete in reverse order
		for (i=self.CurrentBalls.length-1;i>=0;i--) {
			if (Math.abs(self.CurrentBalls[i].x-ballPos.x)<10) {
				self.CurrentBalls[i].kill();
			}
		}
		
		//reset CurrentBalls
		for (i=0;i<self.CurrentBalls.length;i++) {
			self.CurrentBalls[i].SelfIndex=i;
		}
	}
		
	this.addNewMB = function(ballPos) {
		var nextIndex = self.CurrentBalls.length;
		self.CurrentBalls[nextIndex] = new self.Ball(nextIndex, ballPos.x, ballPos.y);
		self.slingPos = {
			"x" : self.CurrentBalls[0].x,
			"y" : self.CurrentBalls[0].y
		}
	}
	
	/* Manage Blocks */
	
	this.addNewBlock = function(newblock) {
	//	console.log(newblock);
		var nextIndex = self.CurrentBlocks.length;
		//var blockx = newblock.x * this.canvas.width / 100 - 15;
		//var blocky = newblock.y * this.canvas.height / 100 - 15;
		self.CurrentBlocks[nextIndex] = new Block(nextIndex, newblock.x, newblock.y, newblock.width, newblock.height);
	//	console.log();
	}
	
	/* Ball object */
	
	this.Ball = function(SelfIndex, SelfX, SelfY) {
		
		this.SelfIndex = SelfIndex;
		this.color = self.skins[0].one;
		this.radius = ballsize;
		this.x = SelfX;
		this.y = SelfY;
		this.size = 5;
		this.directionx = 1;
		this.directiony = 1;
		this.speed = 0;
		this.speedQ = 5;
		this.deltax = 1;
		this.deltay = 1;
		this.echoes = new Array();
		this.echopace = 0;
		
		this.reInit = function() {
			
			this.x = SelfX;
			this.y = SelfY;
			this.size = 10;
			this.directionx = 1;
			this.directiony = 1;
			this.speed = 0;
			this.speedQ = 5;
			this.deltax = 1;
			this.deltay = 1;
			this.echoes = new Array();
			this.echopace = 0;
			
		}
		
		this.move = function() {
			
			this.prex = this.x;
			this.prey = this.y;
			
			this.deltay = this.deltay + gravity;
			
			if (self.clickedR) {
				this.deltax -= clickChange;
			} else if (self.clickedL) {
				this.deltax += clickChange;	
			}
			
			//movement
			this.x += this.deltax;
			this.y += this.deltay;
			
			//bounce check (borders)
		//	if (this.y>(this.space.y2-this.size-2) || this.y<(this.space.y+this.size+2) ) {
			if (this.y>(self.canvas.height-this.size-2)) {
			//	this.bounce("y");
				self.reset();
			}
			
			if (this.x>(self.canvas.width-this.size-2) || this.x<(this.size+2) ) {
			//	this.bounce("x");
				self.reset();
			}
			
			
			var ball = { x: this.x, y: this.y, radius: this.radius }
			var nx = this.deltax;
			var ny = this.deltay + gravity;
			
			//bounce check (hole)
			var rect = { 
						top: self.hole.y, 
						bottom: self.hole.y + self.hole.height, 
						right: self.hole.x + self.hole.width, 
						left: self.hole.x
					}
			var itBounced = ballIntercept(ball,rect,nx,ny);
		//	console.log(itBounced);
			if (itBounced) {
			//	if (itBounced.d=="top") {
					self.won = true;
					self.wonWait = 0;
					console.log("level complete");
			//	}
			}
			
			if (self.won) {
				
				self.wonWait++;
				
				this.deltax = (self.hole.x - this.x);
				this.deltay = (self.hole.y - this.y);
				
				if (self.wonWait>50) {
					self.reset();
				}
				
			} else {
				
				//bounce check (blocks)
				for (i=0;i<self.CurrentBlocks.length;i++) {
					if (!self.CurrentBlocks[i].hit) {
						
						var rect = { 
							top: self.CurrentBlocks[i].y, 
							bottom: self.CurrentBlocks[i].y + self.CurrentBlocks[i].height, 
							right: self.CurrentBlocks[i].x + self.CurrentBlocks[i].width, 
							left: self.CurrentBlocks[i].x
						}
						
					//	console.log(ball, rect, nx, ny);
						
						var itBounced = ballIntercept(ball,rect,nx,ny);
						if (itBounced) {
							//console.log(itBounced)
							
							this.x = itBounced.x;
							this.y = itBounced.y;
						
							switch (itBounced.d) {
								case "left":
									this.bounce("L");
									break;
								case "right":
									this.bounce("R");
									break;
								case "top":
									this.bounce("T");
									break;
								case "bottom":
									this.bounce("B");
									break;
							}
						}
					}
				}
			}
			
			//add echo
			this.echopace++;
			if (this.echopace > 6) {
				this.echoes.unshift({x: this.x, y: this.y});
				if (this.echoes.length>5) {
					this.echoes.length=5;
				}
				this.echopace = 0;
			}
			
			
		}
		
		this.bounce = function(axis) {
			if (axis=="R") {
				this.deltax = this.deltax * -1;
			} else if (axis=="B") {
				this.deltay = this.deltay * bounceLoss;
			} else if (axis=="L") {
				this.deltax = this.deltax * -1;
			} else if (axis=="T") {
				this.deltay = this.deltay * bounceLoss;
			} else if (axis=="x") {
				this.deltax = this.deltax * -1;
			} else if (axis=="y") {
				this.deltay = this.deltay * bounceLoss;
			}
			this.direction = this.direction * (-1);
			
			if (Math.abs(this.deltay)<0.1) {
				this.deltax=0;
				this.deltay=0;
			//	self.reset();
			}
			
		
		}
		
		this.kill = function() {
			self.CurrentBalls.splice(this.SelfIndex,1);
		}
		
		this.draw = function() {
			
			with (self.context) {
				
				if (self.moonReady) {
					drawImage(self.moon, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
				} 
	
	/*			beginPath();
				fillStyle = this.color;
				arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
				fill();
	*/			
		/*		for (i=0;i<this.echoes.length;i++) {
					globalAlpha = (2.5-i/4)/5;
					beginPath();
					arc(this.echoes[i].x, this.echoes[i].y, this.radius, 0, Math.PI*2, true);
					fill();
				}
		*/		
				globalAlpha = 1;
				
			}
		}
	}
	
	
	/* univ function library */
	
	function isInside(clickedNode,currObject) {
		if (clickedNode.x > currObject.x && clickedNode.x < (currObject.x+currObject.wid) && clickedNode.y > currObject.y && clickedNode.y < (currObject.y+currObject.hgt)) {
			return true;	
		} else {
			return false;	
		}
	}
	
	function isInside2(clickedNode,currObject) {
		var xdiff = Math.abs(clickedNode.x - (currObject.x+currObject.wid/2));
		var ydiff = Math.abs(clickedNode.y - (currObject.y+currObject.hgt/2));
		if (xdiff <= clickedNode.radius+currObject.wid/2 && ydiff <= clickedNode.radius+currObject.hgt/2) {
			if (xdiff>ydiff) {
				return "x";	
			} else {
				return "y"
			}
		} else {
			return false;	
		}
	}
	
	function isInside3(clickedNode,currObject) {
		var pi2 = Math.PI*2/16;
		for (i=0;i<16;i++) {
			var thissine = Math.floor(Math.sin(pi2*i)*100)/100;
			var thiscos = Math.floor(Math.cos(pi2*i)*100)/100;
			var xtotest = clickedNode.x+thissine;
			var ytotest = clickedNode.y+thiscos;
			var testNode = {"x": xtotest, "y": ytotest};
			if (isInside(testNode,currObject)) {
				break;
			}
		}
		
	}
	
	
	this.make();
	
	function dream(scale) {
		return ~~(Math.random()*scale);
	}
	
}


	
	
	/* Block object */
	
	this.Block = function(SelfIndex, SelfX, SelfY, SelfWid, SelfHgt) {
		
		this.SelfIndex = SelfIndex;
		var block = this;
		this.x = SelfX;
		this.y = SelfY;
		this.width = SelfWid;
		this.height = SelfHgt;
		this.wid = this.width;
		this.hgt = this.height;
		this.hit = false;
	//	console.log(this);
		
		this.draw = function() {
			if (!block.hit) {
				with (mango1.context) {
					globalAlpha = 0.8;
					fillRect(block.x, block.y, block.width, block.height);
					globalAlpha = 1;
				}
			}
		}
		
	}
	
	var ballIntercept = function(ball, rect, nx, ny) {
	  	var pt;
	    if (ny < 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left   - ball.radius, rect.bottom + ball.radius, rect.right  + ball.radius, rect.bottom + ball.radius, "bottom");
	    }
	    else if (ny > 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.top - ball.radius, rect.right + ball.radius, rect.top - ball.radius, "top");
	    }
	    if (!pt) {
		  if (nx < 0) {
		    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.right + ball.radius, rect.top - ball.radius,  rect.right  + ball.radius, rect.bottom + ball.radius, "right");
		  }
		  else if (nx > 0) {
		    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.top - ball.radius, rect.left - ball.radius, rect.bottom + ball.radius, "left");
		  }
		}
		return pt;
	}


	var intercept = function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
	  var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
	  if (denom != 0) {
	    var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
	    if ((ua >= 0) && (ua <= 1)) {
	      var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
	      if ((ub >= 0) && (ub <= 1)) {
	        var x = x1 + (ua * (x2-x1));
	        var y = y1 + (ua * (y2-y1));
	        return { x: x, y: y, d: d};
	      }
	    }
	  }
	  return null;
	}
