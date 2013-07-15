/************************
* Javascript Mango Game *
* @uthor Ben Taylor     *
************************/
	
	
$(document).ready(function() {
	
	
	context = new webkitAudioContext();
	volume = context.createGainNode();	
	delay = context.createDelayNode();

	delay.delayTime.value = .06;
	delayGain = context.createGainNode();
	delayGain.gain.value = 0.96;
	
	volume.gain.value = 0;
	volume.connect(context.destination);
	volume.connect(delay);
	
	delay.connect(delayGain);
	delayGain.connect(context.destination);
	delayGain.connect(delay);
	
	buff = new Audio("audio/dh_source1.mp3");
	buff.load();
	
	console.log("audio starting to load");
	
	buff.addEventListener("canplaythrough", function() {
		
		bufferNode = context.createMediaElementSource(buff);
		bufferNode.connect(volume);
		buff.currentTime = 0;
		console.log("audio is loaded");
		
	});
	
	scale = [4/5,1/1,2/1,6/5,3/2,8/5];
	fundamental = 248;
	
});

function droneBeat() {

	startOsc();
	setTimeout("droneBeat()",2000);

}

function startOsc() {
	var osc1 = context.createOscillator();
	osc1.type = 0;
	var vol1 = context.createGainNode();
	vol1.gain.value = 0;
	vol1.gain.linearRampToValueAtTime(0, context.currentTime);
	osc1.connect(vol1);
	vol1.connect(context.destination);
	
	var dur = (dream(100) + 2)/10;
	osc1.frequency.value = fundamental * scale[dream(scale.length)];
	console.log(osc1.frequency.value);
	vol1.gain.linearRampToValueAtTime(0, context.currentTime);
	vol1.gain.linearRampToValueAtTime(0.2, context.currentTime+dur/2);
	vol1.gain.linearRampToValueAtTime(0, context.currentTime+dur);
	
	osc1.start(0);
	var t1 = setTimeout('endOsc('+osc1+','+vol1+')', dur);
}

function endOsc(oscObj,volObj) {
	oscObj.stop(0);
	oscObj = null;
	volObj = null;
	console.log("ended");
	
}


				
function mango(target, transmitCommand, uiIndex) {
					
	//self awareness
	var self = this;
	if (!isNaN(uiIndex)) {
		self.uiIndex = uiIndex;
	}
	this.defaultSize = { width: 325, height: 500 };
	
	//get common attributes and methods
	this.getTemplate = getTemplate;
	this.getTemplate(self, target, transmitCommand);
	
	this.CurrentBalls = new Array();
	this.CurrentBlocks = new Array();
	this.UISpaces = new Array();
	
	var ballPos = new Object();
	var clickField = null;
	
	var globalMetro;
	var tempo = 1;
	var tempoMarker = 150;
	var quantize = false;
	var tilt = 0;
	
	this.bgReady = false;
	this.bgimg = null;
	
	this.skins = [
					{ one: "#000" }
	]
	
	this.level = 0;
	this.Levels = [
						[
							{"xpos": 50, "ypos": 25}
						],
						[
							{"xpos": 15, "ypos": 50},
							{"xpos": 50, "ypos": 15},
							{"xpos": 85, "ypos": 50}
						],
						[
							{"xpos": 15, "ypos": 15},
							{"xpos": 25, "ypos": 8},
							{"xpos": 55, "ypos": 60}
						],
						[
							{"xpos": 50, "ypos": 15},
							{"xpos": 50, "ypos": 90}
						],
						[
							{"xpos": 10, "ypos": 55},
							{"xpos": 50, "ypos": 35},
							{"xpos": 10, "ypos": 15}
						],
						[
							{"xpos": 90, "ypos": 60},
							{"xpos": 60, "ypos": 51},
							{"xpos": 90, "ypos": 42},
							{"xpos": 60, "ypos": 33},
							{"xpos": 90, "ypos": 24},
							{"xpos": 60, "ypos": 15}
						],
						[
							{"xpos": 80, "ypos": 60},
							{"xpos": 7, "ypos": 5}
						],
						[
							{"xpos": 35, "ypos": 45},
							{"xpos": 50, "ypos": 5},
							{"xpos": 65, "ypos": 45}
						],
						[
							{"xpos": 35, "ypos": 15},
							{"xpos": 45, "ypos": 8},
							{"xpos": 75, "ypos": 60},
							{"xpos": 75, "ypos": 50}
						],
						[
							{"xpos": 60, "ypos": 10},
							{"xpos": 70, "ypos": 20},
							{"xpos": 80, "ypos": 30},
							{"xpos": 90, "ypos": 40},
							{"xpos": 65, "ypos": 80},
							{"xpos": 75, "ypos": 80},
							{"xpos": 85, "ypos": 80}
						],
						[
							{"xpos": 75, "ypos": 60},
							{"xpos": 60, "ypos": 40},
							{"xpos": 40, "ypos": 65},
							{"xpos": 20, "ypos": 40},
							{"xpos": 40, "ypos": 10},
							{"xpos": 60, "ypos": 33},
							{"xpos": 75, "ypos": 10}
						]
	]
	
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
		this.bgimg.src = "images/Whole.jpg";
						
		this.createUISpaces();
		
		this.addNewMB({"xpos": self.canvas.width/2, "ypos": self.canvas.height*0.8});
		
		this.createLevel();
		
		globalMetro = setInterval(this.canvasID+".pulse()", 10);
		
	}
	
	this.reset = function() {
		
		if (this.CurrentBlocks.length==0) {
			this.level++;
		//	self.bgimg.src = "images/"+self.bgSrcs[dream(self.bgSrcs.length)];
			self.bgimg = self.bgImgs[dream(self.bgImgs.length)];
		}
		
		console.log("resetit");
		
		this.createLevel();
		
		self.slinging = false;
		//self.slingPos = new Object();
		self.moving = false;
		
		self.CurrentBalls[0].xpos = self.canvas.width/2;
		self.CurrentBalls[0].ypos = self.canvas.height*0.8;
		
		self.CurrentBalls[0].deltax = 0;
		self.CurrentBalls[0].deltay = 0;
		
		self.CurrentBalls[0].reInit();
	}
	
	this.createUISpaces = function() {
		
		this.UISpaces = [
							{
								field: "main",
								xpos: 5,
								ypos: 5,
								wid: self.canvas.width-10,
								hgt: self.canvas.height-10,
								hint: "Mango"
							}
						]; 
						
		for (var i=0;i<this.UISpaces.length;i++) {
			this.UISpaces[i].xpos2 = this.UISpaces[i].xpos + this.UISpaces[i].wid;
			this.UISpaces[i].ypos2 = this.UISpaces[i].ypos + this.UISpaces[i].hgt;
			
			this.UISpaces[i].centerx = this.UISpaces[i].xpos + (this.UISpaces[i].wid/2);
			this.UISpaces[i].centery = this.UISpaces[i].ypos + (this.UISpaces[i].hgt/2);
		}
			
	}
	
	this.createLevel = function() {
		this.CurrentBlocks = new Array();
		for (var i=0;i<this.Levels[this.level].length;i++) {
			this.addNewBlock(this.Levels[this.level][i]);
		}
		for (var i=0;i<this.CurrentBlocks.length;i++) {
			this.CurrentBlocks[i].hit=false;
		}
		console.log('levelCreated');
		
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
		
	}
	
	/** Draw framework of rounded rectangles **/
	
	this.drawSpaces = function() {
		
		with (this.context) {
			
			lineWidth = 3;
			strokeStyle = self.colors.border;
			fillStyle = self.colors.fill;
			
			for (var i=0;i<this.UISpaces.length;i++) {
				var space = this.UISpaces[i];
				nx.makeRoundRect(this.context,space.xpos,space.ypos,space.wid,space.hgt);
				stroke();
				
				if (space.field=="quantize" && quantize) {
					fillStyle = self.colors.accent;
					fill();
					fillStyle = self.colors.fill;
				} else {
					fill();
				}
			}
			
			lineWidth=2;
			fillStyle="#ddd";
			lineStyle="#ffffff";
			font="bold 14px courier";
			textAlign = "center";
			
			for (var i=0;i<this.UISpaces.length;i++) {
				var space = this.UISpaces[i];
				fillText(space.hint, space.centerx, space.centery+5);
			}
			
			if (self.bgReady) {
		//		drawImage(self.bgimg, 0, 0, self.canvas.width, self.canvas.height);
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
			for (var i=0;i<self.CurrentBlocks.length;i++) {
				self.CurrentBlocks[i].draw();
			}
		}
	}
	
	/** Mouse functions **/
	this.click = function(e) {
		self.clickPos.xpos = self.clickPos.x;
		self.clickPos.ypos = self.clickPos.y;
		ballPos = self.clickPos;
		for (var i=0;i<self.UISpaces.length;i++) {
			if (isInside(ballPos,self.UISpaces[i])) {
				clickField = self.UISpaces[i].field;
			} 
		}
		
		self.sling = new Object();
		self.sling.wid = self.CurrentBalls[0].radius * 2; 
		self.sling.hgt = self.CurrentBalls[0].radius * 2; 
		self.sling.xpos = self.CurrentBalls[0].xpos - self.CurrentBalls[0].radius; 
		self.sling.ypos = self.CurrentBalls[0].ypos - self.CurrentBalls[0].radius; 
		
		if (isInside(ballPos,self.sling)) {
			self.startSling();
		} else {
			//self.addNewMB(ballPos);
		}
	}
	
	this.move = function(e) {
		self.clickPos.xpos = self.clickPos.x;
		self.clickPos.ypos = self.clickPos.y;
		ballPos = self.clickPos;
		if (self.clicked && self.slinging) {
			self.moveSling(ballPos);
		}
		
	}
	
	this.release = function(e) {
		if (self.slinging) {
			self.startShot();
		}
				
		clickField = null;
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
		self.CurrentBalls[0].xpos = newPos.xpos;
		self.CurrentBalls[0].ypos = newPos.ypos;
		
		self.CurrentBalls[0].deltax = (self.slingPos.xpos - newPos.xpos)/10;
		self.CurrentBalls[0].deltay = (self.slingPos.ypos - newPos.ypos)/10;
	}
	
	this.drawSling = function() {
		with (self.context) {
			globalAlpha = 0.5;
			
			//guide circle
			beginPath();
			strokeStyle = self.skins[0].one;
			lineWidth = 10;
			arc(self.slingPos.xpos, self.slingPos.ypos, 30, 0, Math.PI*2, true);
			stroke();
			closePath();
			
			//guide inner circle
			beginPath();
			fillStyle = self.skins[0].one;
			arc(self.slingPos.xpos, self.slingPos.ypos, 10, 0, Math.PI*2, true);
			fill();
			closePath();
			
			if (self.slinging) {
				//tether
				beginPath();
				moveTo(self.slingPos.xpos, self.slingPos.ypos);
				lineTo(self.CurrentBalls[0].xpos, self.CurrentBalls[0].ypos);
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
		for (var i=self.CurrentBalls.length-1;i>=0;i--) {
			if (Math.abs(self.CurrentBalls[i].xpos-ballPos.xpos)<10) {
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
		self.CurrentBalls[nextIndex] = new self.Ball(nextIndex, ballPos.xpos, ballPos.ypos);
		self.slingPos = {
			"xpos" : self.CurrentBalls[0].xpos,
			"ypos" : self.CurrentBalls[0].ypos
		}
	}
	
	/* Manage Blocks */
	
	this.addNewBlock = function(blockPos) {
		var nextIndex = self.CurrentBlocks.length;
		var blockxpos = blockPos.xpos * this.canvas.width / 100 - 15;
		var blockypos = blockPos.ypos * this.canvas.height / 100 - 15;
		self.CurrentBlocks[nextIndex] = new Block(nextIndex, blockxpos, blockypos);
	}
	
	/* Ball object */
	
	this.Ball = function(SelfIndex, SelfX, SelfY) {
		
		this.SelfIndex = SelfIndex;
		this.space = self.UISpaces[0];
		this.color = self.skins[0].one;
		this.radius = 15;
		this.xpos = SelfX;
		this.ypos = SelfY;
		this.size = 10;
		this.directionx = 1;
		this.directiony = 1;
		this.speed = 0;
		this.speedQ = 5;
		this.deltax = 1;
		this.deltay = 1;
		this.echoes = new Array();
		this.echopace = 0;
		
		this.reInit = function() {
			
			this.xpos = SelfX;
			this.ypos = SelfY;
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
			
			this.prexpos = this.xpos;
			this.preypos = this.ypos;
			
		//	this.deltay = this.deltay + 0.07;
			
			//movement
			this.xpos = this.xpos + this.deltax;
			this.ypos = this.ypos + this.deltay;
			
			//bounce check (borders)
			if (this.ypos>(this.space.ypos2-this.size-2) || this.ypos<(this.space.ypos+this.size+2) ) {
			//	this.bounce("y");
				self.reset();
				this.echopace = 0;
			}
			
			if (this.xpos>(this.space.xpos2-this.size-2) || this.xpos<(this.space.xpos+this.size+2) ) {
			//	this.bounce("x");
				self.reset();
				this.echopace = 0;
			}
			
			//bounce check (blocks)
			for (var i=0;i<self.CurrentBlocks.length;i++) {
				if (!self.CurrentBlocks[i].hit) {
				
					var pi2 = Math.PI*2/16;
					for (j=0;j<16;j++) {
						var breakcheck = false;
						var thissine = (Math.floor(Math.sin(pi2*j)*100)/100)*this.radius;
						var thiscos = (Math.floor(Math.cos(pi2*j)*100)/100)*this.radius;
						var xtotest = this.xpos+thissine;
						var ytotest = this.ypos+thiscos;
						var testNode = {"xpos": xtotest, "ypos": ytotest};
						if (isInside(testNode,self.CurrentBlocks[i])) {
							self.CurrentBlocks[i].hit=true;
							var interpX = (this.xpos + this.prexpos)/2;
							var interpY = (this.ypos + this.preypos)/2;
							var distX = self.CurrentBlocks[i].xpos+self.CurrentBlocks[i].wid/2 - this.xpos;
							var distY = self.CurrentBlocks[i].ypos+self.CurrentBlocks[i].hgt/2 - this.ypos;
							
							//disyX = distX / Math.abs(this.deltay);
							//distY = distY / Math.abs(this.deltax);
							console.log("X: "+distX+"  Y: "+distY);
	
							if (Math.abs(distX)>Math.abs(distY)) {
								if (distX>0) {
									if (this.deltax>0) {
										this.bounce("L");
										console.log("L");
									} else if (this.deltay<0) {
										this.bounce("B");
										console.log("1");
									} else if (this.deltay>0) {
										this.bounce("T");
										console.log("2");
									}
								} else {
									if (this.deltax<0) {
										this.bounce("R");
										console.log("R");
									} else if (this.deltay<0) {
										this.bounce("B");
										console.log("3");
									} else if (this.deltay>0) {
										this.bounce("T");
										console.log("4");
									}
								}
							} else {
								if (distY>0) {
									if (this.deltay>0) {
										this.bounce("T");
										console.log("T");
									} else if (this.deltax<0) {
										this.bounce("R");
										console.log("5");
									} else if (this.deltax>0) {
										this.bounce("L");
										console.log("6");
									}
								} else {
									if (this.deltay<0) {
										this.bounce("B");
										console.log("B");
									} else if (this.deltax<0) {
										this.bounce("R");
										console.log("7");
									} else if (this.deltax>0) {
										this.bounce("L");
										console.log("8");
									}
								}
							}
							
					/*		buff.pause();
							buff.currentTime = Math.floor(self.CurrentBlocks[i].ypos/10 + self.CurrentBlocks[i].xpos/10 + self.level+2);
							buff.play();
							
							volume.gain.linearRampToValueAtTime(0, context.currentTime+0.03);
							volume.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
							volume.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);
					*/
							
					//		self.CurrentBlocks.splice(i,1);
					//		console.log(i);
							
							j=16;
							return;
						}
						
					}
				}
			
			}
			
			//add echo
			this.echopace++;
			if (this.echopace > 3) {
				this.echoes.unshift({xpos: this.xpos, ypos: this.ypos});
				if (this.echoes.length>10) {
					this.echoes.length=10;
				}
				this.echopace = 0;
			}
			
			
		}
		
		this.bounce = function(axis) {
			if (axis=="R") {
				this.deltax = this.deltax * -1;
			} else if (axis=="B") {
				this.deltay = this.deltay * -1;
			} else if (axis=="L") {
				this.deltax = this.deltax * -1;
			} else if (axis=="T") {
				this.deltay = this.deltay * -1;
			} else if (axis=="x") {
				this.deltax = this.deltax * -1;
			} else if (axis=="y") {
				this.deltay = this.deltay * -1;
			}
			this.direction = this.direction * (-1);
			var xMsg = this.xpos/this.space.wid;
			
		
		}
		
		this.kill = function() {
			self.CurrentBalls.splice(this.SelfIndex,1);
		}
		
		this.draw = function() {
			
			with (self.context) {
				beginPath();
				fillStyle = this.color;
				arc(this.xpos, this.ypos, this.radius, 0, Math.PI*2, true);
				fill();
				
				for (var i=0;i<this.echoes.length;i++) {
					globalAlpha = (2.5-i/4)/10;
					beginPath();
					arc(this.echoes[i].xpos, this.echoes[i].ypos, this.radius, 0, Math.PI*2, true);
					fill();
				}
				
				globalAlpha = 1;
				
				
			}
			
		 
			
		}
		
		
	}
	
	
	/* univ function library */
	
	function isInside(clickedNode,currObject) {
		if (clickedNode.xpos > currObject.xpos && clickedNode.xpos < (currObject.xpos+currObject.wid) && clickedNode.ypos > currObject.ypos && clickedNode.ypos < (currObject.ypos+currObject.hgt)) {
			return true;	
		} else {
			return false;	
		}
	}
	
	function isInside2(clickedNode,currObject) {
		var xdiff = Math.abs(clickedNode.xpos - (currObject.xpos+currObject.wid/2));
		var ydiff = Math.abs(clickedNode.ypos - (currObject.ypos+currObject.hgt/2));
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
		for (var i=0;i<16;i++) {
			var thissine = Math.floor(Math.sin(pi2*i)*100)/100;
			var thiscos = Math.floor(Math.cos(pi2*i)*100)/100;
			var xtotest = clickedNode.xpos+thissine;
			var ytotest = clickedNode.ypos+thiscos;
			var testNode = {"xpos": xtotest, "ypos": ytotest};
			if (isInside(testNode,currObject)) {
				break;
			}
		}
		
	}
	
	
	this.make();
	
	function dream(scale) {
		~~(Math.random()*scale);
	}
	
}


	
	
	/* Block object */
	
	this.Block = function(SelfIndex, SelfX, SelfY) {
		
		this.SelfIndex = SelfIndex;
		this.xpos = SelfX;
		this.ypos = SelfY;
		this.width = 30;
		this.height = 30;
		this.wid = this.width;
		this.hgt = this.height;
		this.hit = false;
		
		this.draw = function() {
			if (!this.hit) {
				with (mango1.context) {
					fillRect(this.xpos, this.ypos, this.width, this.height);
				}
			}
		}
		
	}
	

