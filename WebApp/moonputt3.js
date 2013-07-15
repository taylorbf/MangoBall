/************************
* JavaScript Ball Game *
* @author Ben Taylor     *
************************/

/* goals:

make the ball able to rest on ground
second putt
screen in-between each fail w/ score

*/
				
function mango(target, transmitCommand, uiIndex) {
					
	//self awareness
	var self = this;
	if (!isNaN(uiIndex)) {
		self.uiIndex = uiIndex;
	}
	this.defaultSize = { width: 570, height: 300 };
	
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
	
	var gravity = 0.1;
	var bounceLoss = -0.3; //-0.7
	var framerate = 60;
	var slingAffect = 14; //8 -- lower number means more speed
	var ballsize = 3; // 7
	var slingSize = 40;
	var slingThickness = ballsize;
	
	var echoLimit = 7;
	var echoDensity = 2;
	var echoesOn = true;
	
	var clickChange = 0.03;

	var scrollRate = 1;
	this.scrolling = true;	
	
	this.clickedR = false;
	this.clickedL = false;
	
	this.bgReady = false;
	this.bgimg = null;
	
	this.skins = [
					{ one: "#fff",
					  two: "#fff",
					  accent: "#fff",
					  land: "#fff",
					  ice: "#DDD",
					  water: "#0af",
					  jump: "#ff0",
					  bridge: "#3dc",
					  invisible: "#000"
					}
	]
	
	this.level = 0;
	this.allLayouts = [
							// full: x=570, y=300, width=570, height=300
							{
								start: { x: 70, y: 210 },
								walls: [
									{ x: 120,  y: 80, width: 100, height: 5, type: "land" },
									{ x: 220,  y: 280, width: 100, height: 5, type: "land" },
									{ x: 320,  y: 180, width: 100, height: 5, type: "land" },
									{ x: 420,  y: 220, width: 100, height: 5, type: "land" }
								],
								hole: [
									{ x: 410,  y: 250, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 70, y: 210 },
								walls: [
									{ x: 120,  y: 80, width: 100, height: 10, type: "land" },
									{ x: 220,  y: 80, width: 50, height: 10, type: "water" },
									{ x: 270,  y: 80, width: 50, height: 10, type: "land" },
									{ x: 320,  y: 80, width: 50, height: 10, type: "water" },
									{ x: 370,  y: 80, width: 20, height: 10, type: "land" },
								//	{ x: 450,  y: 50, width: 10, height: 210, type: "land" },
									{ x: 320,  y: 160, width: 130, height: 10, type: "jump" },
									{ x: 190,  y: 160, width: 130, height: 10, type: "land" },
									{ x: 120,  y: 90, width: 10, height: 160, type: "land" },
									{ x: 120,  y: 250, width: 250, height: 10, type: "ice" },
									{ x: 10,  y: 100, width: 10, height: 150, type: "land" },
								],
								hole: [
									{ x: 410,  y: 250, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 350,  y: 100, width: 5, height: 30, type: "bridge" },
									{ x: 350,  y: 130, width: 40, height: 5, type: "bridge" },
									{ x: 390,  y: 100, width: 5, height: 30, type: "bridge" }
								],
								hole: [
									{ x: 400,  y: 70, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 400,  y: 250, width: 50, height: 5, type: "jump" },
									{ x: 300,  y: 200, width: 50, height: 5, type: "bridge" },
									{ x: 200,  y: 150, width: 50, height: 5, type: "bridge" },
									{ x: 100,  y: 100, width: 50, height: 5, type: "bridge" }
								],
								hole: [
									{ x: 480,  y: 70, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 400,  y: 100, width: 50, height: 5, type: "land" },
									{ x: 400,  y: 20, width: 5, height: 40, type: "land" }
								],
								hole: [
									{ x: 480,  y: 70, width: 30, height: 30, type: "hole" }
								]
							},
							{
								start: { x: 50, y: 120 },
								walls: [
									{ x: 200,  y: 20, width: 10, height: 300, type: "land" }
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
	
		for (var i=0;i<this.bgSrcs.length;i++) {
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
		
		console.log("reset");
		
		if (this.won) {
		//	self.bgimg = self.bgImgs[dream(self.bgImgs.length)];
			self.level++;
			console.log(self.level, self.allLayouts.length);
			if (self.level>=self.allLayouts.length) {
				self.level = 0;
				console.log("start over");
			}
			self.layout = self.allLayouts[self.level];
			this.CurrentBalls = new Array();
			this.addNewMB({"x": self.layout.start.x, "y": self.layout.start.y});
		}
		
		self.slinging = false;
		self.moving = false;
		self.won = false;
		
		self.CurrentBalls[0].x = self.layout.start.x;
		self.CurrentBalls[0].y = self.layout.start.y;
		
		self.slingPos = {
			"x" : self.CurrentBalls[0].x,
			"y" : self.CurrentBalls[0].y
		}
		
		self.CurrentBalls[0].deltax = 0;
		self.CurrentBalls[0].deltay = 0;
		
		self.CurrentBalls[0].reInit();
		
		this.createLevel();
	}
	
	this.ballStopped = function() {
		
		console.log("ball stopped");
		
		self.slinging = false;
		self.moving = false;
		
		self.layout.start = {
			"x" : self.CurrentBalls[0].x,
			"y" : self.CurrentBalls[0].y
		}
		
		self.slingPos = {
			"x" : self.CurrentBalls[0].x,
			"y" : self.CurrentBalls[0].y
		}
		
	//	self.createLevel();
		
	//	self.CurrentBalls[0].x = self.layout.start.x;
	//	self.CurrentBalls[0].y = self.layout.start.y;
		
		self.CurrentBalls[0].deltax = 0;
		self.CurrentBalls[0].deltay = 0;
		
		self.CurrentBalls[0].reInit();
		
	//	this.createLevel();
		
		
		
	}
	
	
	
	/* Create Stage */
	
	this.createLevel = function() {
		this.CurrentBlocks = new Array();
		for (var i=0;i<self.layout.walls.length;i++) {
		//	this.addNewBlock(this.layout.walls[i]);
			self.CurrentBlocks.push(new Block(i, this.layout.walls[i]));
		}
		this.createHole(this.layout.hole[0]);
	/*	for (var i=0;i<this.CurrentBlocks.length;i++) {
			this.CurrentBlocks[i].hit=false;
	} */
		
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
		if (self.scrolling && self.moving) {
			this.scrollSideways();
		//	this.addBlocks();
		}
		this.drawSpaces();
		this.drawSling();
		this.drawBalls();
		this.drawBlocks();
		this.drawHole();
		
	}
	
	
	
	this.scrollSideways = function() {
		if (self.CurrentBalls[0].x > self.width/2) {
			var scrollDelta = (self.CurrentBalls[0].x - self.width/2)/(self.width/2);
			scrollDelta = scrollRate*scrollDelta*4;
			for (var i=0;i<self.CurrentBlocks.length;i++) {
				self.CurrentBlocks[i].x -= scrollDelta;
			}	
			self.CurrentBalls[0].x -= scrollDelta;
			self.hole.x -= scrollDelta;
			self.slingPos.x -= scrollDelta;
		}
		
	}
	
	
	/** Draw framework of rounded rectangles **/
	
	this.drawSpaces = function() {
		
		with (this.context) {
			
			fillStyle = self.skins[0].two;
			
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
					console.log("go go go");
					self.CurrentBalls[0].move();
				}
				self.CurrentBalls[0].draw();
			}
			
		
	}
	
	this.drawBlocks = function() {
		with (this.context) {
			for (var i=0;i<self.CurrentBlocks.length;i++) {
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
			strokeStyle = self.skins[0].one;
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
			self.sling.x = self.CurrentBalls[0].x - self.sling.wid/2; 
			self.sling.y = self.CurrentBalls[0].y - self.sling.hgt/2; 
			
			if (isInside(ballPos,self.sling)) {
				self.startSling();
			}
		}
	}
	
	this.move = function(e) {
		if (self.clickPos.y >= self.height) {
			self.clickPos.y = self.height-ballsize;
			console.log(self.clickPos.y);
		}
		if (self.clickPos.x <= 0) {
			self.clickPos.x = ballsize;
			console.log(self.clickPos.y);
		}
		ballPos = self.clickPos;
		if (self.clicked && self.slinging) {
			self.moveSling(ballPos);
		}
		
	}
	
	this.release = function(e) {
		console.log("let go");
		if (self.slinging) {
			self.startShot();
			console.log("2");
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
	
	
	
	
	
	/** SLING **/
	
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
		
		self.CurrentBalls[0].x = self.layout.start.x;
		self.CurrentBalls[0].y = self.layout.start.y;
		
		self.moving = true;
	}
	


	/* BLOCKS */
	
	var Block = function(SelfIndex, blockData) {
		
		this.SelfIndex = SelfIndex;
		var block = this;
		this.type = blockData.type;
		this.x = blockData.x;
		this.y = blockData.y;
		this.width = blockData.width;
		this.height = blockData.height;
		this.wid = this.width;
		this.hgt = this.height;
		this.hit = false;
		
		this.draw = function() {
			if (!block.hit) {
				with (mango1.context) {
					globalAlpha = 0.8;
					switch (block.type) {
						case "land":
							fillStyle = mango1.skins[0].land;
							break;
						case "ice":
							fillStyle = mango1.skins[0].ice;
							break;
						case "water":
							fillStyle = mango1.skins[0].water;
							break;
						case "bridge":
							fillStyle = mango1.skins[0].bridge;
							break;
						case "jump":
							fillStyle = mango1.skins[0].jump;
							break;
					}
					fillRect(block.x, block.y, block.width, block.height);
					globalAlpha = 1;
				}
			}
		}
	}
	
	
	
	
	
	
	/* Ball object */
	
	this.Ball = function(SelfIndex, SelfX, SelfY) {
		
		this.SelfIndex = SelfIndex;
		this.color = self.skins[0].accent;
		this.radius = ballsize*2;
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
			
		//	this.x = SelfX;
		//	this.y = SelfY;
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
		//	if (this.y>(self.canvas.height)) {
			//	this.bounce("y");
				self.reset();
				console.log("reset via y");
			}
			
			if (this.x>(self.canvas.width-this.size-2) || this.x<0 ) {
			//	this.bounce("x");
				self.reset();
				console.log("reset via x");
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
			if (itBounced) {
				var noBridges = true;
				for (var i=0;i<self.CurrentBlocks.length;i++) {
					if (self.CurrentBlocks[i].type=="bridge") {
						noBridges = false;
					}
				}
				console.log(noBridges);
			//	if (noBridges) {
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
				for (var i=0;i<self.CurrentBlocks.length;i++) {
					if (!self.CurrentBlocks[i].hit) {
						
						var rect = { 
							top: self.CurrentBlocks[i].y, 
							bottom: self.CurrentBlocks[i].y + self.CurrentBlocks[i].height, 
							right: self.CurrentBlocks[i].x + self.CurrentBlocks[i].width, 
							left: self.CurrentBlocks[i].x
						}
						
						var itBounced = ballIntercept(ball,rect,nx,ny);
						if (itBounced) {
							
							this.x = itBounced.x;
							this.y = itBounced.y;
						
							switch (itBounced.d) {
								case "left":
									this.bounce("L",self.CurrentBlocks[i]);
									break;
								case "right":
									this.bounce("R",self.CurrentBlocks[i]);
									break;
								case "top":
									this.bounce("T",self.CurrentBlocks[i]);
									break;
								case "bottom":
									this.bounce("B",self.CurrentBlocks[i]);
									break;
							}
						}
					}
				}
			}
			
			//add echo
			if (echoesOn) {
				this.echopace++;
				if (this.echopace > echoDensity) {
					this.echoes.unshift({x: this.x, y: this.y});
					if (this.echoes.length>echoLimit) {
						this.echoes.length=echoLimit;
					}
					this.echopace = 0;
				}
			}
			
			
		}
		
		this.bounce = function(axis, hitblock) {
			
		//	self.ballStopped();
		//	current
			if (hitblock.type!="water") {
				if (axis=="R") {
					this.deltax = Math.abs(this.deltax);
				} else if (axis=="B") {
					this.deltay = this.deltay * bounceLoss;
				} else if (axis=="L") {
					this.deltax = Math.abs(this.deltax) * -1;
				//	alert("Bounced L");
				} else if (axis=="T") {
					this.deltay = this.deltay * bounceLoss;
				} else if (axis=="x") {
					this.deltax = this.deltax * -1;
				} else if (axis=="y") {
					this.deltay = this.deltay * bounceLoss;
				}
				this.direction = this.direction * (-1);
			}
			
			
			
		/*	very old
			if (hitblock.type!="water") {
				if (axis=="R") {
					this.deltax = this.deltax * -1;
				} else if (axis=="B") {
					this.deltay = this.deltay * bounceLoss;
				} else if (axis=="L") {
					this.deltax = this.deltax * -1;
					alert("Bounced L");
				} else if (axis=="T") {
					this.deltay = this.deltay * bounceLoss;
				} else if (axis=="x") {
					this.deltax = this.deltax * -1;
				} else if (axis=="y") {
					this.deltay = this.deltay * bounceLoss;
				}
				this.direction = this.direction * (-1);
			}
		*/	
			
			switch (hitblock.type) {
				case "ice":
					this.deltax = (dream(10)-5);
					break;
				case "jump":
					this.deltay -= 4;
					break;
				case "bridge":
					self.CurrentBlocks.splice(hitblock.SelfIndex,1);
					break;
				case "water":
				
					break;
			}
			
			if (Math.abs(this.deltay)<0.1 && hitblock.type=="land") {
				this.deltax=0;
				this.deltay=-.2;
				self.ballStopped();
			}
			
			if (Math.abs(this.deltay)<0.1 && hitblock.type=="ice") {
				this.deltax=0;
				this.deltay=-.2;
				self.ballStopped();
			}
		
			
			
		}
		
		this.kill = function() {
			self.CurrentBalls.splice(this.SelfIndex,1);
		}
		
		this.draw = function() {
			
			with (self.context) {
				
			/*	if (self.moonReady) {
					drawImage(self.moon, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
			}  */
	
				beginPath();
				fillStyle = this.color;
				arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
				fill();
				
				for (var i=0;i<this.echoes.length;i++) {
					globalAlpha = (2.5-i/4)/5;
					beginPath();
					arc(this.echoes[i].x, this.echoes[i].y, this.radius, 0, Math.PI*2, true);
					fill();
				}
				
				globalAlpha = 1;
				
			}
		}
	}
	
	/** Manage Mangos **/
	
	this.deleteMB = function(ballPos) {
		//delete in reverse order
		for (var i=self.CurrentBalls.length-1;i>=0;i--) {
			if (Math.abs(self.CurrentBalls[i].x-ballPos.x)<10) {
				self.CurrentBalls[i].kill();
			}
		}
		
		//reset CurrentBalls
		for (var i=0;i<self.CurrentBalls.length;i++) {
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
	
	
	
	
	
	/* univ function library */
	
	function isInside(clickedNode,currObject) {
		if (clickedNode.x > currObject.x && clickedNode.x < (currObject.x+currObject.wid) && clickedNode.y > currObject.y && clickedNode.y < (currObject.y+currObject.hgt)) {
			return true;	
		} else {
			return false;	
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
	
	function dream(scale) {
		return ~~(Math.random()*scale);
	}
	
	
	
	
	this.make();
	
	
	
}


	
	

