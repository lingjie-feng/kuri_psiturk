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
	"postquestionnaire.html",
	"attention_check.html",
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
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

var Survey = function() {

	var folder_path = "../static/images/online_study_video_all/"

	var anims_color = [
											"white_blink.mp4",
											"blue_blink.mp4",
											"red_blink.mp4",
											"green_blink.mp4",
											"yellow_blink.mp4",];

	var anims_headup_color = [
											"head_up_blue.mp4",
											"head_up_white.mp4",
											"head_up_yellow.mp4",
											"head_up_red.mp4",
											"head_up_green.mp4",];

	var anims_attention = [
											"pay_attention_0times.mp4",
											"pay_attention_2times.mp4",
											"pay_attention_4times.mp4",];

	var anims_feature_eyes = ["neutral_eyes_open.mp4",
												"neutral_eyes_close.mp4",
												"double_blink.mp4",];

	var anims_feature_sound = ["pickup_sounds_on.mp4",
											"putdown_sounds_on.mp4",];

	var anims_emotion = [
											"proud_1_sounds_on.mp4",
											"photo_shoot_1_docked.mp4",
											"gotit_docked_sounds_on.mp4",
											"tickle_sounds_on.mp4",
											"bye_1_sounds_on.mp4",
											"huh2_sounds_on.mp4",
											"giggle_3_sounds_on.mp4",
											"thank_you_1_sounds_on.mp4",
											"huh1_offline_docked_sounds_on.mp4",
											"twitch_1_sounds_on.mp4",
											"ponder_sad.mp4",
											"live_frown.mp4",
											"yes_sounds_on.mp4",
											"no_2_sounds_on.mp4",
											"lost_sounds_on.mp4",];

	shuffle(anims_color);
	shuffle(anims_headup_color);
	shuffle(anims_feature_eyes);
	shuffle(anims_feature_sound);
	shuffle(anims_emotion);
	shuffle(anims_attention);

	// get the index for red color
	var i, red_idx;
	for (i = 0; i < anims_color.length; i++) {
	  if (anims_color[i].includes("red_blink")) {
				red_idx = i;
		}
	}

	var anims = anims_color.concat(anims_headup_color,
														anims_feature_eyes,
														anims_feature_sound,
														anims_emotion,
														anims_attention);

	var anim_idx = 0

	function q1page() {

		var video = document.getElementById('anim_video');
		video.src = folder_path + anims[anim_idx];
		video.play();

		var header = document.getElementById('anim_header');
		header.innerHTML = "Robot Behavior Video " + (anim_idx + 1).toString()
											+ " of " + anims.length.toString();

		if (anims[anim_idx].includes("sounds_on")) {
			var sounds_on_txt = document.getElementById('sounds_on_txt');
			sounds_on_txt.innerHTML = "sounds on";
		}

		if (anims[anim_idx].includes("attention")) {
			var bar1_left_txt = document.getElementById('bar1_left_txt');
			bar1_left_txt.innerHTML = "Distracted";
			var bar1_right_txt = document.getElementById('bar1_right_txt');
			bar1_right_txt.innerHTML = "Attentive";

			var bar2_left_txt = document.getElementById('bar2_left_txt');
			bar2_left_txt.innerHTML = "Inert";
			var bar2_right_txt = document.getElementById('bar2_right_txt');
			bar2_right_txt.innerHTML = "Interactive";
		}

		var positivity = 50;
		var intensity = 50;
		var socialness = 50;
		var bar1_select = false;
		var bar2_select = false;
		var bar3_select = false;
		$("#positivity_range").on("input", function() {
			positivity = this.value;
			this.style.background = '#346abf';
			bar1_select = true;
			console.log(positivity);
		});

		$("#intensity_range").on("input", function() {
			intensity = this.value;
			this.style.background = '#346abf';
			bar2_select = true;
			console.log(intensity);
		});

		$("#socialness_range").on("input", function() {
			socialness = this.value;
			this.style.background = '#346abf';
			bar3_select = true;
			console.log(intensity);
		});

		$("#nextL").click(function () {
			if (bar1_select && bar2_select && bar3_select) {

				psiTurk.recordTrialData({'phase':anims[anim_idx],
																'positivity':positivity,
																'intensity':intensity,
																'socialness':socialness});
			
				anim_idx = anim_idx + 1;
			
				if (anim_idx == red_idx + 1) {
					psiTurk.showPage("attention_check.html");
					attention_check();
			
				} else if (anim_idx < anims.length) {
					psiTurk.showPage('q1.html');
					q1page();
			
				} else {
					psiTurk.recordTrialData({'phase':'survey', 'status':'submit'});
					currentview = new Questionnaire();
				}
			
			} else {
			
				var warning_txt = document.getElementById('warning_txt');
				warning_txt.innerHTML = 'Please adjust all slidebars to evaluate.';
			
			}
		});
	}

	function attention_check() {

		// var answer = document.getElementById('answer');

		$("#nextL").click(function () {

			const rbs1 = document.querySelectorAll('input[name="answers[1]"]');
			let selectedQ1, answer;
			for (const rb of rbs1) {
					if (rb.checked) {
							answer = rb.value;
							selectedQ1 = true;
							console.log("answer:" + answer);
							break;
					}
			}

			if (selectedQ1) {

				psiTurk.recordTrialData({'phase':'attention_check', 'answer':answer});
				psiTurk.showPage('q1.html');
				q1page();

			} else {
				psiTurk.showPage("attention_check.html");
				var warning_txt = document.getElementById('warning_txt');
				warning_txt.innerHTML = "Please select one answer to continue";
				attention_check();
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

		var gender_describe = document.getElementById('gender_describe').value;

		var age_input = document.getElementById("age_input").value;

		var worker_id = document.getElementById('worker_id').value;

		psiTurk.recordTrialData({'phase':'postquestionnaire',
														'status':'submit',
														'worker_id':worker_id,
														'gender': gender,
														'gender_describe': gender_describe,
														'age': age_input,
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

			var warning_txt = document.getElementById('warning_txt');

			if (!gender_selected) {
				warning_txt.innerHTML = "Please select gender to continue.";
				return;
			}
			
			var worker_id = document.getElementById('worker_id').value;
			console.log("worker id:" + worker_id);
			if (worker_id === "") {
				warning_txt.innerHTML = "Please write down your worker ID.";
				return;
			}

			var age_input;
			age_input = document.getElementById("age_input").valueAsNumber;
			console.log(document.getElementById("age_input").value);
			if (isNaN(age_input)) {
				warning_txt.innerHTML = "Please input a valid age number.";
				return;
			} else if (age_input >= 130 || age_input <= 0) {
					warning_txt.innerHTML = "The input age is not within a valid range.";
					return;
			}


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
