/************************
* JavaScript Ball Game *
* @author Ben Taylor     *
************************/

				
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
	
	var globalMetro = false;
	var tempo = 1;
	var tempoMarker = 150;
	var quantize = false;
	var tilt = 0;
	
	var gravity = 0.1;
	var bounceLoss = -0.3; //-0.7
	var framerate = 60;
	var slingAffect = 12; //8 -- lower number means more speed
	var ballsize = 3; // 7
	var slingSize = 40;
	var slingThickness = ballsize;
	
	var echoLimit = 7;
	var echoDensity = 2;
	var echoesOn = true;
	
	var clickChange = 0.02; // 0.03
	var spinChange = 0; // 0.03

	var scrollRate = 1;
	this.scrolling = false;	
	
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
							// layout fullsize: x=570, y=300, width=570, height=300
	this.portalsLayouts = [
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 460, height: 5, type: "land" }
								],
								hole: [
									{ x: 470, y: 230, width: 30, height: 30, type: "hole" }
								],
								portals: [ ],
								tip: "Touch and drag the white circle to sling the ball into the blue hole."
							},
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 550, height: 10, type: "land" },
									{ x: 230, y: 130, width: 100, height: 100, type: "land" }
								],
								hole: [
									{ x: 350, y: 200, width: 30, height: 30, type: "hole" }
								],
								portals: [ ],
								tip: "After releasing the ball, touch the screen to add spin to the ball"
							},
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 500, height: 10, type: "land" },
									{ x: 150, y: -100, width: 50, height: 330, type: "land" }
								],
								hole: [
									{ x: 450, y: 50, width: 30, height: 30, type: "hole" }
								],
								portals: [ 
									[
										{ x: 100, y: 100, width: 30, height: 30, type: "in"},
										{ x: 250, y: 200, width: 30, height: 30, type: "out"}	
									]
								],
								tip: "Red portals transport the ball between them"
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
								],
								portals: [ ]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 350,  y: 100, width: 5, height: 30, type: "bridge" },
									{ x: 350,  y: 130, width: 40, height: 5, type: "bridge" },
									{ x: 390,  y: 100, width: 5, height: 30, type: "land" }
								],
								hole: [
									{ x: 400,  y: 70, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
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
								],
								portals: [ ]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 400,  y: 100, width: 50, height: 5, type: "land" },
									{ x: 400,  y: 20, width: 5, height: 40, type: "land" }
								],
								hole: [
									{ x: 480,  y: 70, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							},
							{
								start: { x: 50, y: 120 },
								walls: [
									{ x: 200,  y: 20, width: 10, height: 300, type: "land" }
								],
								hole: [
									{ x: 480,  y: 220, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							},
							
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 460, height: 5, type: "land" }
								],
								hole: [
									{ x: 470, y: 230, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							},
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 550, height: 10, type: "land" },
									{ x: 230, y: 130, width: 100, height: 100, type: "land" }
								],
								hole: [
									{ x: 350, y: 200, width: 30, height: 30, type: "hole" }
								],
								portals: [
									[
										{ x: 150, y: 100, width: 30, height: 30, type: "in"},
										{ x: 350, y: 100, width: 30, height: 30, type: "out"}	
									]
								]
							},
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 400, height: 10, type: "land" },
									{ x: 230, y: 130, width: 100, height: 100, type: "land" },
									{ x: 400, y: 30, width: 10, height: 130, type: "land" },
									{ x: 410, y: 230, width: 100, height: 10, type: "jump" }
								],
								hole: [
									{ x: 450, y: 50, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
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
								],
								portals: [ ]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 350,  y: 100, width: 5, height: 30, type: "bridge" },
									{ x: 350,  y: 130, width: 40, height: 5, type: "bridge" },
									{ x: 390,  y: 100, width: 5, height: 30, type: "land" }
								],
								hole: [
									{ x: 400,  y: 70, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
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
								],
								portals: [ ]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 400,  y: 100, width: 50, height: 5, type: "land" },
									{ x: 400,  y: 20, width: 5, height: 40, type: "land" }
								],
								hole: [
									{ x: 480,  y: 70, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							},
							{
								start: { x: 50, y: 120 },
								walls: [
									{ x: 200,  y: 20, width: 10, height: 300, type: "land" }
								],
								hole: [
									{ x: 480,  y: 220, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							},
							{
								start: { x: 70, y: 220 },
								walls: [
									{ x: 400,  y: 100, width: 50, height: 5, type: "land" },
									{ x: 400,  y: 20, width: 5, height: 40, type: "land" }
								],
								hole: [
									{ x: 480,  y: 70, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							}, 
							{
								start: { x: 50, y: 120 },
								walls: [
									{ x: 200,  y: 20, width: 10, height: 300, type: "land" }
								],
								hole: [
									{ x: 480,  y: 220, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							}
	]
    
	this.bridgesLayouts = [
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 460, height: 5, type: "land" }
								],
								hole: [
									{ x: 470, y: 100, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							}
	]
	this.holeinoneLayouts = [
							{
								start: { x: 80, y: 220 },
								walls: [
									{ x: 10, y: 230, width: 460, height: 5, type: "land" }
								],
								hole: [
									{ x: 470, y: 0, width: 30, height: 30, type: "hole" }
								],
								portals: [ ]
							}
	]
	this.allLayouts = self.portalsLayouts;
	this.layout = JSON.stringify(this.allLayouts[self.level]);
	this.layout = JSON.parse(this.layout);
	
	this.bgSrcs = [
					"Whole.jpg",
					"SimplisticComplexity.jpg",
					"Sherbert.jpg",
					"Quark.jpg",
					"Gatorade.jpg",
					"kaleid2.png"
	
	]
	this.bgImgs = new Array();
	this.currentStroke = -1;
	
	this.textureSrcs = [ "big_bg_jump.jpg", "bg_ice.jpg", "bg_jump.jpg", ];
	this.textureImgs = new Array();
	this.textures = new Array();
    
    
    /** Initialize Object **/
	
	this.make = function() {
	
		for (var i=0;i<self.allLayouts.length;i++) {
			if (localStorage["best"+i]==undefined || localStorage["best"+i]==0) {
				localStorage["best"+i] = "none";
			}
		}
		
		for (var i=0;i<this.bgSrcs.length;i++) {
			self.bgImgs[i] = new Image();
			self.bgImgs[i].src = "images/"+this.bgSrcs[i];
	 	}
	 	
		for (var i=0;i<this.textureSrcs.length;i++) {
			self.textureImgs[i] = new Image();
		    self.textureImgs[i].onload = function() {
		    	for (j=0;j<self.textureImgs.length;j++) {
		        	self.textures[j] = self.context.createPattern(self.textureImgs[j], 'repeat');
		    	}
		    };
			self.textureImgs[i].src = "images/"+this.textureSrcs[i];
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
		
		this.startPulse();
	
	}
	
	this.startPulse = function() {
		if (!globalMetro) {
			globalMetro = setInterval(this.canvasID+".pulse()", ~~(1000/framerate));	
		}
	}
	
	this.stopPulse = function() {
		clearInterval(globalMetro);
		globalMetro = false;
	}
	
	this.reset = function(jumpToNext) {

				
		if (jumpToNext) {
			self.level++;
			self.currentStroke=-1;
			self.countAStroke();
			//$("#gametips").html("Strokes "+self.currentStroke+"<br>Best Score "+localStorage["best"+self.level]);
			if (self.level>=self.allLayouts.length) {
				self.level = 0;
			}
			self.layout = JSON.stringify(self.allLayouts[self.level]);
			self.layout = JSON.parse(self.layout);
			this.CurrentBalls = new Array();
			this.addNewMB({"x": self.layout.start.x, "y": self.layout.start.y});
		} else {
			self.countAStroke();
		}
		
		self.slinging = false;
		self.moving = false;
		self.won = false;
		
		self.CurrentBalls[0].x = self.layout.start.x;
		self.CurrentBalls[0].y = self.layout.start.y;
		self.CurrentBalls[0].spin = 0;
		self.CurrentBalls[0].spinRotation = 0;
		
		self.slingPos = {
			"x" : self.CurrentBalls[0].x,
			"y" : self.CurrentBalls[0].y
		}
		
		self.CurrentBalls[0].deltax = 0;
		self.CurrentBalls[0].deltay = 0;
		
		self.CurrentBalls[0].reInit();
		
		this.createLevel();
		
		self.startPulse();
	}
	
	this.countAStroke = function() {
		self.currentStroke++;
		$("#gametips").html("Strokes "+self.currentStroke+"<br>Best Score "+localStorage["best"+self.level]);
	}
	
	this.ballStopped = function() {
		
		self.countAStroke();
		
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
	
	
	/* Display Pages */
	
	this.slideTime = 500;
	
	this.displaySplash = function() {
		$("#loadingscreen").animate({"left": "0px"}, self.slideTime);
	//	$("#worlds").hide(0);
	}
	
	this.displayWorldOptions = function() {
		$("#loadingscreen").animate({"left": "-570px"}, self.slideTime);
		$("#chapters").animate({"left": "570px"}, self.slideTime);
		$("#worlds").show(0).animate({"left": "0px"}, self.slideTime);
		$("#navbg").show(0).animate({"left": "0px"}, self.slideTime);
	}
	
	this.openWorld = function(whichworld) {
		switch(whichworld) {
			case "portals":
				self.allLayouts = self.portalsLayouts;
				break;
			case "bridges":
				self.allLayouts = self.bridgesLayouts;
				break;
			case "holeinone":
				self.allLayouts = self.holeinoneLayouts;
				break;
		}
		$("#worlds").animate({"left": "-570px"}, self.slideTime);
		self.displayChapters();
	}
	
	this.displayChapters = function() {
	
		var lastOpenLevelFound = false;
		var htmlstr = '<div class="backoption" onclick="mango1.displayWorldOptions()"></div>'
					+ '<div class="chaptertitle" style="width:400px;margin:20px auto;text-align:center;">Choose a Level</div>'
					+ '<div style="margin:30px auto;width:500px;">';
		for (var i=0;i<self.allLayouts.length;i++) {
			if (localStorage["best"+i]!="none" || !lastOpenLevelFound) {
				if (localStorage["best"+i]=="none") {
					lastOpenLevelFound = true;
				}
				htmlstr += '<div class="chapterbuttonoutline">'
						+ '<div class="chapterbutton" onclick="mango1.displayLevel('+i+')">';
				if (localStorage["best"+i]!="none") {
						htmlstr += (i+1) + '<div style="font-size:8pt">best '+localStorage["best"+i]+'</div>';
				} else {
					    htmlstr += (i+1) + '<div style="font-size:9pt">_</div>';
				}
				htmlstr	+= '</div>'
						+ '</div>';
			} else if (localStorage["best"+i]=="none") {
				htmlstr += '<div class="chapterbuttonoutline" style="opacity:0.5">'
						+ '<div class="chapterbutton"">'
						+ (i+1)
					    + '<div style="font-size:9pt">_</div>'
						+ '</div>'
						+ '</div>';
			}
		}
		
	/*	htmlstr += '<div class="chapterbuttonoutline">'
				+ '<div class="chapterbutton" onclick="mango1.clearStorage();">'
				+ 'erase'
				+ '</div>'
				+ '</div>'; */
				
		htmlstr += '</div>';
		
		$("#chapters").html(htmlstr).show(0).animate({"left": "0px"}, self.slideTime);	
		
	}
	
	this.clearStorage = function() {
		for (var i=0;i<self.allLayouts.length;i++) {
			localStorage["best"+i] = "none";
		}
		console.log(localStorage);
	}
	
	this.displayLevel = function(levelNum) {
		
		self.level = levelNum;
		
		self.layout = JSON.stringify(self.allLayouts[self.level]);
		self.layout = JSON.parse(self.layout);
		
		this.CurrentBalls = new Array();
		this.addNewMB({"x": self.layout.start.x, "y": self.layout.start.y});
		
		self.currentStroke = -1;
		self.reset();
		self.startPulse();
		
		$("#chapters, #navbg").animate({"left": "-570px"}, self.slideTime);	
		
	}
	
	this.displayPause = function() {
		console.log("paused");
		$("#pause, #navbg").animate({"left": "0px"}, 0);
		self.stopPulse();
		
	}
	
	this.continuePlaying = function() {
		$("#pause, #navbg").animate({"left": "-570px"}, 0);
		self.startPulse();
		
	}
	
	this.displayWin = function() {
		self.currentStroke++;
		if (self.currentStroke<localStorage["best"+self.level] || localStorage["best"+self.level]=="none" || localStorage["best"+self.level]=="undefined") {
			localStorage["best"+self.level] = self.currentStroke;
		}
		$("#winstrokes").html(self.currentStroke);
		$("#levelwon, #navbg").animate({"left": "0px"}, self.slideTime);	;
		
	}
	
	this.displayLose = function() {
		$("#levellost, #navbg").animate({"left": "0px"}, self.slideTime);	
	}
	
	this.retryLevel = function() {
		$("#pause, #navbg").animate({"left": "-570px"}, self.slideTime);
		$("#levelwon").animate({"left": "-570px"}, self.slideTime);
		$("#levellost").animate({"left": "-570px"}, self.slideTime);
		self.currentStroke = -1;
		self.displayLevel(self.level);
	}
	
	this.startNextLevel = function() {
		$("#levelwon, #navbg").animate({"left": "-570px"}, self.slideTime)
		self.reset(true);
	}
	
	this.exitToChapters = function() {
		self.displayChapters();
		$("#levelwon").animate({"left": "-570px"}, self.slideTime);
		$("#levellost").animate({"left": "-570px"}, self.slideTime);
		$("#pause").animate({"left": "-570px"}, self.slideTime);
		self.reset();
		$("#chapters, #navbg").animate({"left": "0px"}, self.slideTime)
	}
	
	/* Create Stage */
	
	this.createLevel = function() {
		this.CurrentBlocks = new Array();
		for (var i=0;i<self.layout.walls.length;i++) {
		//	this.addNewBlock(this.layout.walls[i]);
			self.CurrentBlocks.push(new Block(i, this.layout.walls[i]));
		}
		self.portals = self.layout.portals;
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
		this.drawTip();
		
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
		with (self.context) {
			globalAlpha = 0.5;
			fillStyle = "#0af";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height);
			fillStyle = "#6cf";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height/1.5);
			fillStyle = "#cef";
			fillRect(self.hole.x,self.hole.y, self.hole.width, self.hole.height/3);
			globalAlpha = 1;
		}
		for (var i=0;i<self.portals.length;i++) {
			var curPortalIn = self.portals[i][0];
			var curPortalOut = self.portals[i][1];
			with (self.context) {
				globalAlpha = 0.5;
				fillStyle = "#f22";
				fillRect(curPortalIn.x,curPortalIn.y, curPortalIn.width, curPortalIn.height);
				fillRect(curPortalOut.x,curPortalOut.y, curPortalOut.width, curPortalOut.height);
				fillStyle = "#f66";
				fillRect(curPortalIn.x,curPortalIn.y, curPortalIn.width, curPortalIn.height/1.5);
				fillRect(curPortalOut.x,curPortalOut.y, curPortalOut.width, curPortalOut.height/1.5);
				fillStyle = "#faa";
				fillRect(curPortalIn.x,curPortalIn.y, curPortalIn.width, curPortalIn.height/3);
				fillRect(curPortalOut.x,curPortalOut.y, curPortalOut.width, curPortalOut.height/3);
				globalAlpha = 0.6;
				fillStyle = "#fff";
				textAlign = "center";
				font="20px courier";
				textBaseline = "middle";
				fillText(i+1,curPortalIn.x+curPortalIn.width/2,curPortalIn.y+curPortalIn.height/2);
				fillText(i+1,curPortalOut.x+curPortalOut.width/2,curPortalOut.y+curPortalOut.height/2);
				globalAlpha = 1;
			}
		}
	
	/*
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
	*/	
		
	}
	
	
	this.drawTip = function() {
		if (self.layout.tip) {
			with (self.context) {
				fillStyle = "#fff";
				textAlign = "center";
				globalAlpha = 1;
				font = "bold 15px Geo";
				fillText(self.layout.tip,self.width/2,self.height-20);
				globalAlpha = 1;
			}
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
		}
		if (self.clickPos.x <= 0) {
			self.clickPos.x = ballsize;
		}
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
				
				//guides
		/*		globalAlpha = 0.1;
				fillStyle = "#fff";
				fillRect(20,self.height-20,self.width,20); */
				
		//		var xgauge = Math.floor(Math.abs(self.CurrentBalls[0].deltax*30)+Math.abs(self.CurrentBalls[0].deltay*30));
				var xgauge = Math.floor((Math.sqrt(Math.pow(self.CurrentBalls[0].deltax,2)+Math.pow(self.CurrentBalls[0].deltay,2)))*10);
				var xloc = xgauge;
				
		/*		globalAlpha = 0.6;
				
				var grd = createLinearGradient(self.width,self.height,0,self.height);
				grd.addColorStop(0,"#00aaff");
				grd.addColorStop(1,"#aaaaaa");
				fillStyle = grd;
				fillRect(0,self.height-20,xloc,20); */
				
				globalAlpha = 1;
				fillStyle = "#ddd";
				textAlign = "center";
				font = "10px arial";
				fillText(xgauge,self.slingPos.x,self.slingPos.y-25);
				
				
		/*		globalAlpha = 0.1;
				fillStyle = "#fff";
				fillRect(0,0,20,self.height);
				fillRect(20,self.height-20,self.width,20);
				var xgauge = Math.floor(self.CurrentBalls[0].deltax*20);
				var ygauge = Math.floor(self.CurrentBalls[0].deltay*20);
				var xloc = self.width/2+xgauge;
				var yloc = self.height/2+ygauge;
				
				globalAlpha = 0.6;
				
				var grd = createLinearGradient(0,0,0,self.height);
				grd.addColorStop(0,"#00aaff");
				grd.addColorStop(1,"#aaaaaa");
				fillStyle = grd;
				fillRect(0,self.height/2,20,ygauge);
				var grd = createLinearGradient(self.width,self.height,0,self.height);
				grd.addColorStop(0,"#00aaff");
				grd.addColorStop(1,"#aaaaaa");
				fillStyle = grd;
				fillRect(self.width/2,self.height-20,xgauge,20);
				
				globalAlpha = 1;
				fillStyle = "#ddd";
				fillText(xgauge,xloc,self.height-5);
				fillText(ygauge,5,yloc); */
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
						//	fillStyle = mango1.skins[0].land;
							fillStyle = mango1.textures[0];
							break;
						case "ice":
						//	fillStyle = mango1.skins[0].ice;
							fillStyle = mango1.textures[1];
							break;
						case "water":
							fillStyle = mango1.skins[0].water;
							break;
						case "bridge":
							fillStyle = mango1.skins[0].bridge;
							break;
						case "jump":
						//	fillStyle = mango1.skins[0].jump;
							fillStyle = mango1.textures[2];
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
		this.spin = 0;
		this.spinRotation = 0;
		this.friction = 0.8;
		
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
				this.spin -= clickChange*6;
			} else if (self.clickedL) {
				this.deltax += clickChange;	
				this.spin += clickChange*6;
			}
			
			//movement
			this.x += this.deltax;
			this.y += this.deltay;
			
			//bounce check (borders)
		//	if (this.y>(this.space.y2-this.size-2) || this.y<(this.space.y+this.size+2) ) {
			if (this.y>(self.canvas.height-this.size-2)) {
		//	if (this.y>(self.canvas.height)) {
			//	this.bounce("y");
			//	self.displayLose();
				self.reset();
			}
			
			if (this.x>(self.canvas.width-this.size-2) || this.x<0 ) {
			//	this.bounce("x");
				self.reset();
			//	self.displayLose();
			}
			
			
			var ball = { x: this.x, y: this.y, radius: this.radius }
			var nx = this.deltax;
			var ny = this.deltay + gravity;
			
			//bounce check portal
			for (var i=0;i<self.portals.length;i++) {
			//	var pBounce = holeIntercept(ball,self.portals[i][0],nx,ny);
				if (isInside2(ball,self.portals[i][0])) {
					this.x = this.x-self.portals[i][0].x+self.portals[i][1].x;
					this.y = this.y-self.portals[i][0].y+self.portals[i][1].y;
				//	this.deltay = 0;
				//	this.deltax = 0;
				}
			}			
			
			
			//bounce check (hole)
			var rect = { 
						top: self.hole.y, 
						bottom: self.hole.y + self.hole.height, 
						right: self.hole.x + self.hole.width, 
						left: self.hole.x
					}
		
			var allBouncesAccounted = true;
			var bouncesAccounted = new Array();
			
			do {		
					
				var itBounced = holeIntercept(ball,rect,nx,ny);
				if (itBounced) {
					var noBridges = true;
					for (var i=0;i<self.CurrentBlocks.length;i++) {
						if (self.CurrentBlocks[i].type=="bridge") {
							noBridges = false;
						}
					}
				
					if (bouncesAccounted.indexOf(itBounced.d)==-1) {
						bouncesAccounted.push(itBounced.d);
						allBouncesAccounted = false;
						switch (itBounced.d) {
							case "left":
								this.bounce("L",{"type": "hole"});
								break;
							case "right":
								this.bounce("R",{"type": "hole"});
								break;
							case "top":
								this.bounce("T",{"type": "hole"});
								break;
							case "bottom":
								this.bounce("B",{"type": "hole"});
								break;
						} 
					
					} else {
						allBouncesAccounted = true;
					}
						
				//	if (noBridges) {
						self.won = true;
						self.wonWait = 0;
				//	}
				} else {
					allBouncesAccounted = true;
				}
				
			} while (!allBouncesAccounted);
			
			if (self.won) {
				
			//	console.log (this.x, rect.right);
				if (this.x>rect.right-this.radius) {
					this.x=rect.right - this.radius*2;
					console.log ("bumped");
				}
				if (this.x<rect.left+this.radius) {
					this.x=rect.left + this.radius*2;
				}
				
				self.wonWait++;
				
			//	this.deltax = (self.hole.x - this.x);
			//	this.deltay = (self.hole.y - this.y);
				
				if (self.wonWait>200) {
					self.displayWin();
					self.stopPulse();
				//	self.reset();
				}
				
			} else {
				
				var allBouncesAccounted = true;
				var bouncesAccounted = new Array();
				
				do {
					
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
								
							//	this.x = itBounced.x;
							//	this.y = itBounced.y;
								
								if (bouncesAccounted.indexOf(itBounced.d)==-1) {
									bouncesAccounted.push(itBounced.d);
									allBouncesAccounted = false;
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
								} else {
									allBouncesAccounted = true;
								}
							} else {
								allBouncesAccounted = true;
							}
						}
					}
				} while (!allBouncesAccounted);
				
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
				this.deltax = this.deltax * this.friction;
				this.deltax = this.deltax + this.spin/3;
				this.spin = 0;
				if (axis=="R") {
					this.deltax = Math.abs(this.deltax);
				} else if (axis=="B") {
					this.deltay = Math.abs(this.deltay);
				} else if (axis=="L") {
					this.deltax = Math.abs(this.deltax) * -1;
				//	alert("Bounced L");
				} else if (axis=="T") {
					this.deltay = Math.abs(this.deltay) * bounceLoss;
				} else if (axis=="x") {
					this.deltax = this.deltax * -1;
				} else if (axis=="y") {
					this.deltay = this.deltay * bounceLoss;
				}
				this.direction = this.direction * (-1);
			}
			
			
		
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
			
			
			/* roll and stop */
			
			if (hitblock.type=="land" || hitblock.type=="ice") {
			
				if (Math.abs(this.deltay)<0.2 && Math.abs(this.deltax)<0.1) {
					this.deltax=0;
					this.deltay=-.2;
					self.ballStopped();
				} else {
					if (Math.abs(this.deltay)<0.2) {
					//	this.deltax=0;
						this.deltay=-.4;
					//	self.ballStopped();
					}
				}
			
			}
			
			if (hitblock.type=="hole" ) {
			
				if (Math.abs(this.deltay)<0.2 && Math.abs(this.deltax)<0.1) {
					this.deltax=0;
					this.deltay=-.2;
					self.displayWin();
					self.stopPulse();
				} else {
					if (Math.abs(this.deltay)<0.2) {
					//	this.deltax=0;
						this.deltay=-.4;
					//	self.ballStopped();
					}
				}
			
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
				closePath();
				
	
			if (self.moving) {
				
				this.spinRotation = this.spinRotation + (this.spin/20);
								
				globalAlpha = 1;
				beginPath();
				strokeStyle = "#000";
				arc(this.x, this.y, this.radius-4, Math.PI*this.spinRotation+Math.PI*.5, Math.PI*this.spinRotation, true);
				lineWidth = 5;
				stroke();
				closePath(); 
				
				beginPath();
				arc(this.x, this.y, this.radius-4, Math.PI*this.spinRotation+Math.PI*1.5, Math.PI*this.spinRotation+Math.PI*1, true);
				stroke();
				closePath();
				globalAlpha = 1;
			}	
				
				for (var i=0;i<this.echoes.length;i++) {
					globalAlpha = (2.5-i/4)/5;
					beginPath();
					arc(this.echoes[i].x, this.echoes[i].y, this.radius, 0, Math.PI*2, true);
					fill();
					closePath();
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
	
	function isInside2(clickedNode,currObject) {
		if (clickedNode.x > currObject.x && clickedNode.x < (currObject.x+currObject.width) && clickedNode.y > currObject.y && clickedNode.y < (currObject.y+currObject.height)) {
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
	
	
	
	
		
	var holeIntercept = function(ball, rect, nx, ny) {
	  	var pt;
	    if (ny < 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.top + ball.radius, rect.right + ball.radius, rect.top + ball.radius, "bottom");
	    }
	    else if (ny > 0) {
	      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left - ball.radius, rect.bottom - ball.radius, rect.right + ball.radius, rect.bottom - ball.radius, "top");
	    }
	    if (!pt) {
		  if (nx < 0) {
		    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.left + ball.radius, rect.top - ball.radius,  rect.left  + ball.radius, rect.bottom + ball.radius, "right");
		  }
		  else if (nx > 0) {
		    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, rect.right - ball.radius, rect.top - ball.radius, rect.right - ball.radius, rect.bottom + ball.radius, "left");
		  }
		}
		return pt;
	}
	
	
	
	function dream(scale) {
		return ~~(Math.random()*scale);
	}
	
	
	
	
	this.make();
	
	
	
}


	
	

