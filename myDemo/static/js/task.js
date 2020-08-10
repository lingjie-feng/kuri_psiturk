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
	"q4.html",
	"q5.html",
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
	var likertResponse0; 
	var likertResponse1; 
	var likertResponse2; 
	var likertResponse3; 
	var likertResponse4; 
	var likertResponse5;
	var likertResponse6;
	function click_store(){
		$("#strongly_agree_0").click(function() {
			likertResponse0 = this.value;
		})
		$("#agree_0").click(function() {
			likertResponse0 = this.value;
		})
		$("#neutral_0").click(function() {
			likertResponse0 = this.value;
		})
		$("#disagree_0").click(function() {
			likertResponse0 = this.value;
		})
		$("#strongly_disagree_0").click(function() {
			likertResponse0 = this.value;
		})

		$("#strongly_agree_1").click(function() {
			likertResponse1 = this.value;
		})
		$("#agree_1").click(function() {
			likertResponse1 = this.value;
		})
		$("#neutral_1").click(function() {
			likertResponse1 = this.value;
		})
		$("#disagree_1").click(function() {
			likertResponse1 = this.value;
		})
		$("#strongly_disagree_1").click(function() {
			likertResponse1 = this.value;
		})

		$("#strongly_agree_2").click(function() {
			likertResponse2 = this.value;
		})
		$("#agree_2").click(function() {
			likertResponse2 = this.value;
		})
		$("#neutral_2").click(function() {
			likertResponse2 = this.value;
		})
		$("#disagree_2").click(function() {
			likertResponse2 = this.value;
		})
		$("#strongly_disagree_2").click(function() {
			likertResponse2 = this.value;
		})

		$("#strongly_agree_3").click(function() {
			likertResponse3 = this.value;
		})
		$("#agree_3").click(function() {
			likertResponse3 = this.value;
		})
		$("#neutral_3").click(function() {
			likertResponse3 = this.value;
		})
		$("#disagree_3").click(function() {
			likertResponse3 = this.value;
		})
		$("#strongly_disagree_3").click(function() {
			likertResponse3 = this.value;
		})

		$("#strongly_agree_4").click(function() {
			likertResponse4 = this.value;
		})
		$("#agree_4").click(function() {
			likertResponse4 = this.value;
		})
		$("#neutral_4").click(function() {
			likertResponse4 = this.value;
		})
		$("#disagree_4").click(function() {
			likertResponse4 = this.value;
		})
		$("#strongly_disagree_4").click(function() {
			likertResponse4 = this.value;
		})

		$("#strongly_agree_5").click(function() {
			likertResponse5 = this.value;
		})
		$("#agree_5").click(function() {
			likertResponse5 = this.value;
		})
		$("#neutral_5").click(function() {
			likertResponse5 = this.value;
		})
		$("#disagree_5").click(function() {
			likertResponse5 = this.value;
		})
		$("#strongly_disagree_5").click(function() {
			likertResponse5 = this.value;
		})

		$("#strongly_agree_6").click(function() {
			likertResponse6 = this.value;
		})
		$("#agree_6").click(function() {
			likertResponse6 = this.value;
		})
		$("#neutral_6").click(function() {
			likertResponse6 = this.value;
		})
		$("#disagree_6").click(function() {
			likertResponse6 = this.value;
		})
		$("#strongly_disagree_6").click(function() {
			likertResponse6 = this.value;
		})
	}

	function q1page() {
		click_store();
		$("#nextL").click(function () {
			psiTurk.recordTrialData({'phase':"scenario 1", 'response1':likertResponse0, 'response2':likertResponse1, 'response3':likertResponse2, 'response4':likertResponse3});
			psiTurk.showPage('q2.html');
			q2page();
		});
	}

	function q2page(){
		click_store();
		$("#nextL").click(function () {
			psiTurk.recordTrialData({'phase':"scenario 2", 'response1':likertResponse0, 'response2':likertResponse1, 'response3':likertResponse2, 'response4':likertResponse3});
			psiTurk.showPage('q3.html');
			q3page();
		});
	}

	function q3page(){
		click_store();
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
			psiTurk.recordTrialData({'phase':"scenario 3", 'response1':likertResponse0, 'response2':likertResponse1, 'response3':likertResponse2, 'response4':likertResponse3, 'response5':likertResponse4, 'response6':likertResponse5, 'response7':likertResponse6});
			psiTurk.showPage('q4.html');
			q4page();
		});
	}

	function q4page(){
		var checkedbox = []
		$("#nextL").click(function () {
			$("input:checked").each( function(){
				checkedbox.push(this.value); 
			});
			psiTurk.recordTrialData({'phase':"scenario 4", 'response':checkedbox});
			psiTurk.showPage('q5.html');
			q5page();
		});
	}
	
	function q5page(){
		var checkedbox = []
		/*$("#submit").click(function () {
			var text = document.getElementById("sa").value;
			psiTurk.recordUnstructuredData("text response", text);
			currentview = new Questionnaire();});*/
		$("#nextL").click(function () {
			$("input:checked").each( function(){
				checkedbox.push(this.value); 
			});
			psiTurk.recordTrialData({'phase':"scenario 5", 'response':checkedbox});
			psiTurk.recordTrialData({'phase':'survey', 'status':'submit'});
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
