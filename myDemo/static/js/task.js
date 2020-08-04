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
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-4.html",
	"instructions/instruct-5.html",
	"instructions/instruct-6.html",
	"instructions/instruct-7.html",
	"instructions/instruct-8.html",
	"instructions/instruct-ready.html",
	"welcome.html",
	"q1.html",
	"q2.html",
	"q3.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-4.html",
	"instructions/instruct-5.html",
	"instructions/instruct-6.html",
	"instructions/instruct-7.html",
	"instructions/instruct-8.html",
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

var Survey = function() {	
	var likertResponse; 
	function q1page() {
		$("#strongly_agree").click(function() {
			likertResponse = this.id;
		})
		$("#agree").click(function() {
			likertResponse = this.id;
		})
		$("#neutral").click(function() {
			likertResponse = this.id;
		})
		$("#disagree").click(function() {
			likertResponse = this.id;
		})
		$("#strongly_disagree").click(function() {
			likertResponse = this.id;
		})
		$("#nextL").click(function () {
			psiTurk.recordTrialData({'phase':"question 1", 'response':likertResponse});
			psiTurk.showPage('q2.html');
			q2page();
		});
	}

	function q2page(){
		$("#strongly_agree").click(function() {
			likertResponse = this.id;
		})
		$("#agree").click(function() {
			likertResponse = this.id;
		})
		$("#neutral").click(function() {
			likertResponse = this.id;
		})
		$("#disagree").click(function() {
			likertResponse = this.id;
		})
		$("#strongly_disagree").click(function() {
			likertResponse = this.id;
		})
		$("#nextL").click(function () {
			psiTurk.recordTrialData({'phase':"question 2", 'response':likertResponse});
			psiTurk.showPage('q3.html');
			fshortanswerpage();
		});
	}
	
	function fshortanswerpage(){
		$("#strongly_agree").click(function() {
			likertResponse = this.id;
		})
		$("#agree").click(function() {
			likertResponse = this.id;
		})
		$("#neutral").click(function() {
			likertResponse = this.id;
		})
		$("#disagree").click(function() {
			likertResponse = this.id;
		})
		$("#strongly_disagree").click(function() {
			likertResponse = this.id;
		})
		/*$("#submit").click(function () {
			var text = document.getElementById("sa").value;
			psiTurk.recordUnstructuredData("text response", text);
			currentview = new Questionnaire();});*/
		$("#nextL").click(function () {
				psiTurk.recordTrialData({'phase':"question 3", 'response':likertResponse});
				fshortanswerpage();
				currentview = new Questionnaire();
		});

	}

	psiTurk.recordTrialData({'phase':'survey', 'status':'begin'});
	psiTurk.showPage('welcome.html');
	
	$("#startButton").click(function () {
		psiTurk.showPage('q1.html');
		q1page();
	});	
}

/****************
* Questionnaire *
****************/

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
