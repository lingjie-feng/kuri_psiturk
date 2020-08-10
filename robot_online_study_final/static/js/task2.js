/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-ready.html",
	"survey.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-ready.html"
];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

// Add push (to store answers)
var Survey = function() {	
psiTurk.showPage("survey.html");
psiTurk.recordTrialData({'phase':'survey', 'status':'begin'});

var q = 0,
	textLongEnough = false,
	flagMulti = false,
	paramHTML = "";
	
$(function() {
	$("#wrap").fadeIn(500);
	welcomeScreen();
	navButtons();
	
	$("#qBox").on("click", ".begin", function () {
		reset();
	});
	
	$("#aBox").on("click", ".single", function() {
		if ($("#wrap").hasClass("paused") === false) {
			// Handles trigger questions
			if ($(this).hasClass("helpWithWebsite")) {
				 qa[1].cssQ = "text";
			} else {
				singleClicked();
			}
		}
	});
	
	// Handles typing in textarea
	$("#aBox").on("keyup", ".textArea", function(e) {
		var numChars = $(".textArea").val().length;
		var minChars = 10;
		var submitMarkup = "<div class='inputNext'>Submit</div>";
		var submitClass = ".inputNext";
		
		$(".textCounter").html(numChars + " chars");
		
		if ($("#wrap").hasClass("paused")) {
			e.preventDefault();
		} else {
			checkLength(numChars, minChars, submitMarkup, submitClass);
		}
	});
	
	// Submit textarea
	$("#submitBox").on("click", ".inputNext", function() {
		if ($("#wrap").hasClass("paused") === false) {
			inputClicked();
		}
	});
		
	// Handles typing in text input
	$("#aBox").on("keyup", "input", function(e) {
		var numChars = $("input").val().length;
		var minChars = 4;
		var submitMarkup = "<div class='textNext'>Submit</div>";
		var submitClass = ".textNext";
		
		checkLength(numChars, minChars, submitMarkup, submitClass);
	});
	
	// Submit text input
	$("#submitBox").on("click", ".textNext", function() {
		if ($("#wrap").hasClass("paused") === false) {
			if ($("input").hasClass("url")) {
				var inputValue = $(".url").val();
				var inputPre = inputValue.slice(0, 4);

				if (inputPre === "http") {
					var inputSplit = inputValue.split("://");
					inputPre = inputSplit[1].slice(0, 4);
					inputValue = inputSplit[1];
				}								
				if (inputPre != "www.") {
					inputValue = "www." + inputValue;
				}

				var firstDotPos = inputValue.indexOf(".");
				var lastDotPos = inputValue.lastIndexOf(".");
				var textLength = inputValue.length;

				if ((firstDotPos === lastDotPos) || (lastDotPos === - 1) || ((lastDotPos + 2) >= textLength)) {
					$("#error").html("That isn't a valid URL.<br>Please enter the address of the website.");
				} else {
					$("#error").html("");
					textLongEnough = false;
					reset();
				}	
			} else {
				reset();
			}
		}
	});
		
	// Handles multiple choice selection
	$("#aBox").on("click", ".multiple", function() {
		if ($("#wrap").hasClass("paused") === false) {
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				$(this).css("background-color", "#fefefe");
				$(this).css("color", "#403e30");
				$(this).find("i").removeClass("fa-check-square-o");
				$(this).find("i").addClass("fa-square-o");
			} else {
				$(this).addClass("selected");
				$(this).css("background-color", "#00a1e4");	
				$(this).css("color", "#eee");
				$(this).find("i").removeClass("fa-square-o");
				$(this).find("i").addClass("fa-check-square-o");
			}

			if ($(".answers").hasClass("selected")) {
				if (flagMulti === false) {
					$("<div class='multipleDone'>Submit</div>").hide().appendTo("#submitBox").fadeIn(500);
					$("#error").html("");
					flagMulti = true;
				}
			} else {
				$(".multipleDone").remove();
				$("#error").html("Please select at least one answer");
				flagMulti = false;
			}
		}
	});

    	// Submit multiple choice
	$("#submitBox").on("click", ".multipleDone", function() {
		if ($("#wrap").hasClass("paused") === false) {
			multiClicked();
		}
	});
	
	// Back button
	$("#backIcon").on("click", function() {
		if ($("#wrap").hasClass("paused") === false) {
			back();
		}
	});
	
	// Fwd button
	$("#fwdIcon").on("click", function() {
		if ($("#wrap").hasClass("paused") === false) {
			fwd();
		}
	});

	// Exit button
	$("#exit").on("click", function() {
		if ($("#wrap").hasClass("paused") === false) {
			quit();
		}
	});
	
	// Reopen questionnaire
	$("#qOpen").on("click", function() {
	//$("#qOpen").click(function() {
		reOpen();
	});
	
	// Erase Answers and Start Over
	$("#startOver").on("click", function () {
		verifyStartOver();
	});
	
	// Start Over = Cancel
	$("#startOverNo").on("click", function() {
		$("#verifyBox").animate({opacity: "0"}, 150);
		$("#wrap").removeClass("blurred");
		$("#wrap").removeClass("paused");
		$('.text').prop('readonly', false);
	});
	
	// Star Over = Yes
	$("#startOverYes").on("click", function() {
		startOver();
	});
}); // end DOM ready function


/***** 
Functions 
******/

function welcomeScreen() {
	$("#backIcon").hide();
	
	$("<div id='welcome'><h1>Request a Quote</h1>The following questionnaire will take between 5-15 minutes of your time. It will help me determine how I can help you. <br><br> If you're not sure how to answer something, leave it out and we'll discuss it later.</div><div class='begin'>Begin</div>").hide().appendTo("#qBox").fadeIn(500);
}

function nextQuestion() {
	var qClass = qa[q].cssQ;
	$("<div class='question'></div>").hide().appendTo("#qBox").fadeIn(500);
	$(".question").html(qa[q].question);
	$(".question").addClass(qClass);
	
	for(i = 0; i < qa[q].answers.length; i++) {
		var aClass = qa[q].cssA[i];
		var answer = qa[q].answers[i];
		
		$("<div class='answers " + qClass + " " + aClass + "'>" + answer + "</div>").hide().appendTo("#aBox").fadeIn(900);
		};
		if (qClass === "multiple") {
			$("<i class='fa fa-square-o'></i> ").hide().prependTo(".answers").fadeIn(900);
		} else if (qClass === "input") {
			$("<div class='textCounter'></div>").appendTo(".answers");
		}
	q += 1;
	navButtons();
}

function singleClicked() {
	// store answer
	reset();
}

function inputClicked() {
	// store answer
	textLongEnough = false;
	reset();
}

function multiClicked() {
	// store answer
	flagMulti = false;
	reset();
}

// Check textarea and text input
function checkLength(numChars, minChars, submitMarkup, submitClass) {
	$(".textCounter").addClass("red");
	if (numChars < minChars) {
		if (textLongEnough === true) {
			$(submitClass).remove();
			$("#error").html("Your answer is too short");
			textLongEnough = false;
		} 
	} else if ((numChars = minChars) || (numChars > minChars)) {
		$(".textCounter").removeClass("red");
		if (textLongEnough === false) {
			$("#error").html("");
			$(submitMarkup).hide().appendTo("#submitBox").fadeIn(500);
			textLongEnough = true;
		}
	}
}


function reset() {
	$("#welcome").remove();
	$(".begin").remove();
	$(".question").remove();
	$(".answers").remove(); 
	$(".inputNext").remove();
	$(".textURLNext").remove();
	$(".textNext").remove();
	$(".multipleDone").remove();
	$("#error").html("");
	nextQuestion();
}
	
function quit() {
	$("#wrap").hide();
	$("#qOpen").animate({bottom:"0px"}, 200);
}

function reOpen() {
	$("#wrap").fadeIn();
	$("#qOpen").animate({bottom:"-50px"}, 200);
}

function back() {
	q = q - 2;
	navButtons();
	reset();
}

function fwd() {
	navButtons();
	reset();
}

function navButtons() {
	if (q > 0) {
		$("#backIcon").fadeIn(400);
	} else if (q === qa.length) {
		$("#fwdIcon").hide();
	} else if (q < 0) {
		// fix this
		$("#fwdIcon").fadeIn(400);			  
	} else {
		$("#backIcon").hide();
	}
}

function verifyStartOver() {
	window.scrollTo(0, 0);
	$("#wrap").addClass("blurred");
	$("#wrap").addClass("paused");
	$('.text').prop('readonly', true);
	$("#verifyBox").animate({opacity: "1"}, 150);
}
	
function startOver() {
	var q = 0;
	textLongEnough = false;
	flagMultiple = false;
	paramHTML = "";
	$("#verifyBox").animate({opacity: "0"}, 150);
	$("#wrap").removeClass("blurred");
	$("#wrap").removeClass("paused");
	reset();
}
	
//var storeAnswers = new Array();
		

/***** 
Questions 
******/
				
var qa = [
	{cssQ: "input", question: "What is the purpose of the website?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textPurpose"]},
	{cssQ: "input", question: "Briefly describe your project:", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textProjectDesc"]},
	{cssQ: "input", question: "List at least 6 keywords that describe your project:", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textKeywords"]},
	{cssQ: "input",  question: "Describe the ideal visitor to your website:", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textIdeaVisitor"]},
	{cssQ: "multiple", question: "How old are they?<br>(Select all that apply)", answers: ["13 - 19", "20 - 29", "30 - 39", "40 - 49", "50 - 59", "60+"], cssA: ["13", "20", "30", "40", "50", "60"]},
	{cssQ: "multiple", question: "Where do they live?<br>(Select all that apply)", answers: ["Canada", "U.S.A.", "International"], cssA: ["canada", "usa", "intl"]},
	{cssQ: "multiple", question: "What is their gross annual income?<br>(Select all that apply)", answers: ["$0 - $6,000", "$6,000 - $12,000", "$12,000 - $24,000", "$24,000 - $35,000", "$35,000 - $50,000", "$50,000 - $80,000", "$80,000 - $100,000", "$100,000+"], cssA: ["lowIncome", "6000", "12000", "24000", "35000", "50000", "80000", "100000"]},
	{cssQ: "input", question: "What kind of lifestyle do they live?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textLifestyle"]},
	{cssQ: "multiple", question: "What do they do?<br>(Select all that apply)", answers: ["Work", "Professional", "Unemployed", "Retired", "Stay at home", "Student", "Other"], cssA: ["work", "professional", "unemployed", "retired", "stayHome", "student", "otherWork"]},
	{cssQ: "input", question: "Who else do you want to attract to your website?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textAttract"]},
	{cssQ: "input", question: "What is the first thing a visitor should do on your website?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textFirstAction"]},
	{cssQ: "input", question: "What is the one thing a visitor should do before they leave your website?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textLastAction"]},
	{cssQ: "multiple", question: "Which features does your website need?<br>(Select all that apply)", answers: ["The ability to edit it myself", "A blog", "Gallery of images", "Embedded video", "eCommerce", "Something custom"], cssA: ["editWebsite", "blog", "embedVideo", "eCom", "customWebsite"]},
	{cssQ: "text", question: "What is a website that looks similar to what you want?", answers: ["<input type='text' class='url' placeholder='www.'></input>"], cssA: ["textSimilarWebsite"]},
	{cssQ: "input", question: "What do you like about it?", answers: ["<textarea rows='5' class='textArea'></textarea>"], cssA: ["textLikeSimilarWebsite"]},
	{cssQ: "single", question: "How will you measure the success of your website?", answers: ["Traffic (number of visitors)", "Volume of sales", "Volume of registrations or bookings", "Fewer offline inquiries", "Other", "I don't intend to track my website"], cssA: ["successTraffic", "successSales", "successInquiries", "successOther", "successNoTracking"]},
	{cssQ: "single", question: "When are you ready to start working on your website?", answers: ["Right away", "2 weeks", "1 month", "3 months", "6 months", "I'm not sure"], cssA: ["startNow", "start2Weeks", "start1Month", "start6Months", "startUnsure"]},	
	{cssQ: "single", question: "When do you anticipate having your images and content ready?", answers: ["It's ready now", "2 weeks", "1 month", "3 months", "I'm not sure"], cssA: ["contentNow", "content2Weeks", "content1Month", "contentUnsure"]},
	{cssQ: "single", question: "When would you like your website to be ready?", answers: ["6 weeks", "2 months", "4 months", "6 months", "Within the year", "I'm not sure"], cssA: ["launch6Weeks", "launch2Months", "launch4Months", "launchThisYear", "launchUnsure"]},	
	{cssQ: "single", question: "What is your development budget?", answers: ["$500 - $1,000", "$1,000 - $2,000", "$2,000 - $4,000", "$4,000 - $8,000", "$8,000 - $10,000", "$10,000+"], cssA: ["budget500", "budget1000", "budget2000", "budget4000", "budget8000", "budget10000"]},
	{cssQ: "single", question: "What is your annual maintenance budget?", answers: ["$100 - $300", "$300 - $400", "$400 - $600", "$600 - $800"], cssA: ["maintenance100", "maintenance300", "maintenance400", "maintenance600"]},		
	{cssQ: "single", question: "Have you purchased a domain name?", answers: ["Yes", "No, and I intend to", "No, and I would like you to do it for me", "What is a domain name?"], cssA: ["domainYes", "domainIntend", "domainRegister", "domainUnsure"]},	
	{cssQ: "single", question: "Have you purchased a hosting package?", answers: ["Yes", "No, and I intend to", "No, and I would like you to do it for me", "What is a hosting package?"], cssA: ["hostingYes", "hostingIntend", "hostingRegister", "hostingUnsure"]},
	{cssQ: "text", question: "What is your name?", answers: ["<input type='text' class='text' placeholder=''></input>"], cssA: ["name"]},
	{cssQ: "text", question: "What is your email?", answers: ["<input type='text' class='text' placeholder=''></input>"], cssA: ["email"]},
	{cssQ: "text", question: "What is your phone number?", answers: ["<input type='text' class='text' placeholder='www.'></input>"], cssA: ["phone"]}
];
}

var Questionnaire = function() { 
	
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {  

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});  

		$('textarea').each( function(i, val) {   
			psiTurk.recordUnstructuredData(this.id, this.value);
		}); 
		$('select').each( function(i, val) {   
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});   
 
	};  

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new Survey(); } // what you want to do when you are done with instructions
    );
});
