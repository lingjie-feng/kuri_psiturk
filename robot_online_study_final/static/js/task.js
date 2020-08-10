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
	"welcome.html",
	"q1.html",
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

var Survey = function() {

	var folder_path = "../static/images/social_behaviors/"
	var anims = ["stopped_no_2.mp4",
								"turn_taking_bye_1.mp4",
								"stopped_live_frown.mp4"];
	// var anims = ["bye_1_sounds_on.mp4",
	// 							"giggle_3_sounds_on.mp4",
	// 							"head_up_white.mp4"];

	var anim_idx = 0

	function q1page() {

		var video = document.getElementById('anim_video');
		video.src = folder_path + anims[anim_idx];
		video.play();

		var header = document.getElementById('anim_header');
		header.innerHTML = "Robot Behaivor Video " + (anim_idx + 1).toString()
											+ " (" + anims.length.toString() + " videos in total)";

		if (anims[anim_idx].includes("sounds_on")) {
			var sounds_on_txt = document.getElementById('sounds_on_txt');
			sounds_on_txt.innerHTML = "sounds on";
		}

		var positivity = 50;
		var intensity = 50;
		var socialness = 50;

		$("#positivity_range").on("input", function() {
			positivity = this.value;
			console.log(positivity);
		});

		$("#intensity_range").on("input", function() {
			intensity = this.value;
			console.log(intensity);
		});

		$("#socialness_range").on("input", function() {
			socialness = this.value;
			console.log(intensity);
		});

		$("#nextL").click(function () {
			psiTurk.recordTrialData({'phase':anims[anim_idx],
															'positivity':positivity,
															'intensity':intensity,
															'socialness':socialness});
			anim_idx = anim_idx + 1;
			if (anim_idx < anims.length) {
				psiTurk.showPage('q1.html');
				q1page();
			} else {
				psiTurk.recordTrialData({'phase':'survey', 'status':'submit'});
				currentview = new Questionnaire();
			}
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

		// extrapolate comment, experience and gender values from the questionnaire
		var comment, robot_experience, gender;
		comment = document.getElementById('comment').value;
		robot_experience = document.getElementById('robot_experience').value;
		console.log("comment:" + comment);
		console.log("robot_experience:" + robot_experience);

		var gender_rds, gender_selected;
		gender_rds = document.querySelectorAll('input[name="answers[1]"]');

		for (const rb of gender_rds) {
				if (rb.checked) {
						gender = rb.value;
						gender_selected = true;
						console.log("gender:" + gender);
						break;
				}
		}

		psiTurk.recordTrialData({'phase':'postquestionnaire',
														'status':'submit',
														'gender':gender,
														'robot_experience':robot_experience,
														'comment': comment});

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
