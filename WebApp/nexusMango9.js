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
					{ one: "#000",
					  two: "#0af" 
					}
	]
	
	this.level = 0;
	this.allLayouts = [
							{
								start: { x: 100, y: 200 },
								walls: [
									{ x: 150,  y: 100, width: 25, height: 200, type: "land" },
									{ x: 200,  y: 250, width: 100, height: 20, type: "land" },
									{ x: 350,  y: 200, width: 100, height: 20, type: "land" }
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
		this.bgimg.src = "images/Whole.jpg";
						
		this.createUISpaces();
		
		this.addNewMB({"xpos": self.layout.start.x, "ypos": self.layout.start.y});
		
		this.createLevel();
		
		globalMetro = setInterval(this.canvasID+".pulse()", 10);
		
	}
	
	this.reset = function() {
		
		if (this.CurrentBlocks.length==0) {
			this.level++;
			self.bgimg = self.bgImgs[dream(self.bgImgs.length)];
		}
		
		this.createLevel();
		
		self.slinging = false;
		self.moving = false;
		
		self.layout = self.allLayouts[self.level];
		
		self.CurrentBalls[0].xpos = self.layout.start.x;
		self.CurrentBalls[0].ypos = self.layout.start.y;
		
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
						
		for (i=0;i<this.UISpaces.length;i++) {
			this.UISpaces[i].xpos2 = this.UISpaces[i].xpos + this.UISpaces[i].wid;
			this.UISpaces[i].ypos2 = this.UISpaces[i].ypos + this.UISpaces[i].hgt;
			
			this.UISpaces[i].centerx = this.UISpaces[i].xpos + (this.UISpaces[i].wid/2);
			this.UISpaces[i].centery = this.UISpaces[i].ypos + (this.UISpaces[i].hgt/2);
		}
			
	}
	
	this.createLevel = function() {
		this.CurrentBlocks = new Array();
		for (i=0;i<self.layout.walls.length;i++) {
			this.addNewBlock(this.layout.walls[i]);
		}
		for (i=0;i<this.CurrentBlocks.length;i++) {
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
			
		/*	for (i=0;i<this.UISpaces.length;i++) {
				var space = this.UISpaces[i];
				nx.makeRoundRect(this.context,space.xpos,space.ypos,space.wid,space.hgt);
				stroke();
				fill();
		} */
			
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
	
	/** Mouse functions **/
	this.click = function(e) {
		self.clickPos.xpos = self.clickPos.x;
		self.clickPos.ypos = self.clickPos.y;
		ballPos = self.clickPos;
		for (i=0;i<self.UISpaces.length;i++) {
			if (isInside(ballPos,self.UISpaces[i])) {
				clickField = self.UISpaces[i].field;
			} 
		}
		
		self.sling = new Object();
		self.sling.wid = self.CurrentBalls[0].radius * 4; 
		self.sling.hgt = self.CurrentBalls[0].radius * 4; 
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
			strokeStyle = self.skins[0].two;
			lineWidth = 10;
			arc(self.slingPos.xpos, self.slingPos.ypos, 15, 0, Math.PI*2, true);
			stroke();
			closePath();
			
			//guide inner circle
			beginPath();
			fillStyle = self.skins[0].one;
			arc(self.slingPos.xpos, self.slingPos.ypos, 5, 0, Math.PI*2, true);
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
		for (i=self.CurrentBalls.length-1;i>=0;i--) {
			if (Math.abs(self.CurrentBalls[i].xpos-ballPos.xpos)<10) {
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
		self.CurrentBalls[nextIndex] = new self.Ball(nextIndex, ballPos.xpos, ballPos.ypos);
		self.slingPos = {
			"xpos" : self.CurrentBalls[0].xpos,
			"ypos" : self.CurrentBalls[0].ypos
		}
	}
	
	/* Manage Blocks */
	
	this.addNewBlock = function(newblock) {
		console.log(newblock);
		var nextIndex = self.CurrentBlocks.length;
		//var blockxpos = newblock.x * this.canvas.width / 100 - 15;
		//var blockypos = newblock.y * this.canvas.height / 100 - 15;
		self.CurrentBlocks[nextIndex] = new Block(nextIndex, newblock.x, newblock.y, newblock.width, newblock.height);
		console.log();
	}
	
	/* Ball object */
	
	this.Ball = function(SelfIndex, SelfX, SelfY) {
		
		this.SelfIndex = SelfIndex;
		this.space = self.UISpaces[0];
		this.color = self.skins[0].one;
		this.radius = 10;
		this.xpos = SelfX;
		this.ypos = SelfY;
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
			
			this.deltay = this.deltay + 0.07;
			
			//movement
		//	this.xpos = this.xpos + this.deltax;
		//	this.ypos = this.ypos + this.deltay;
			this.xpos += this.deltax;
			this.ypos += this.deltay;
			
			//bounce check (borders)
			if (this.ypos>(this.space.ypos2-this.size-2) || this.ypos<(this.space.ypos+this.size+2) ) {
				this.bounce("y");
			//	self.reset();
			//	this.echopace = 0;
			}
			
			if (this.xpos>(this.space.xpos2-this.size-2) || this.xpos<(this.space.xpos+this.size+2) ) {
				this.bounce("x");
			//	self.reset();
			//	this.echopace = 0;
			}
			
			//bounce check (blocks)
			for (i=0;i<self.CurrentBlocks.length;i++) {
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
						//	self.CurrentBlocks[i].hit=true;
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
							
						//	self.CurrentBlocks.splice(i,1);
							
							j=16;
							return;
						}
						
					}
				}
			
			}
			
			//add echo
			this.echopace++;
			if (this.echopace > 6) {
				this.echoes.unshift({xpos: this.xpos, ypos: this.ypos});
				if (this.echoes.length>5) {
					this.echoes.length=5;
				}
				this.echopace = 0;
			}
			
			
		}
		
		this.bounce = function(axis) {
			var bounceLoss = -0.9;
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
				
		/*		for (i=0;i<this.echoes.length;i++) {
					globalAlpha = (2.5-i/4)/5;
					beginPath();
					arc(this.echoes[i].xpos, this.echoes[i].ypos, this.radius, 0, Math.PI*2, true);
					fill();
				}
		*/		
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
		for (i=0;i<16;i++) {
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
		return ~~(Math.random()*scale);
	}
	
}


	
	
	/* Block object */
	
	this.Block = function(SelfIndex, SelfX, SelfY, SelfWid, SelfHgt) {
		
		this.SelfIndex = SelfIndex;
		var block = this;
		this.xpos = SelfX;
		this.ypos = SelfY;
		this.width = SelfWid;
		this.height = SelfHgt;
		this.wid = this.width;
		this.hgt = this.height;
		this.hit = false;
		console.log(this);
		
		this.draw = function() {
			if (!block.hit) {
				with (mango1.context) {
				//	console.log(mango1.context);
					fillRect(block.xpos, block.ypos, block.width, block.height);
				}
			}
		}
		
	}
	
	var ballIntercept = function(ball, rect, nx, ny) {
	  var pt;
	  if (nx < 0) {
	    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.right + ball.radius, rect.top - ball.radius,  rect.right  + ball.radius, rect.bottom + ball.radius, "right");
	  }
	  else if (nx > 0) {
	    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.top - ball.radius, rect.left - ball.radius, rect.bottom + ball.radius, "left");
	  }
	  if (!pt) {
	    if (ny < 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left   - ball.radius, 
	                                 rect.bottom + ball.radius, rect.right  + ball.radius, rect.bottom + ball.radius, "bottom");
	    }
	    else if (ny > 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.top - ball.radius, rect.right + ball.radius, rect.top - ball.radius, "top");
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
