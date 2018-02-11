/*
|----------------------------------
| Document Ready Variables
|----------------------------------
*/
"use strict";
$(document).ready(function(){
	/*  Ensure that stats tables are populated by any existing logged tasks on page load */
	populate_stats_table(JSON.parse(localStorage.getItem('task_logged')));
	aggregate_stats(JSON.parse(localStorage.getItem('task_logged')));

	/* 
	Persist radio state in local storage 
	(with credit to SitePoint: https://codepen.io/SitePoint/pen/xVevNw)
	*/
	var radioValues = JSON.parse(localStorage.getItem('radioValues')) || {},
	$radios = $("#projects-container :radio");
	$radios.change(function(){
		$radios.each(function(){
			radioValues[this.id] = this.checked;
		});
		localStorage.setItem("radioValues", JSON.stringify(radioValues));
	});

	$.each(radioValues, function(key, value) {
		$("#" + key).prop('checked', value);
	});

	/* 
	Persist start and finish buttons.
	*/
	var buttonState = JSON.parse(localStorage.getItem('buttonState')) || {},
	$buttons = $("#button-container :button");
	$buttons.click(function(){		
		$buttons.each(function(){
			buttonState[this.id] = this.disabled;
		});
		localStorage.setItem("buttonState", JSON.stringify(buttonState));
	});
	// console.log(JSON.parse(localStorage.getItem('buttonState')));
	$.each(buttonState, function(key, value) {
		$("#" + key).attr('disabled', value);
	});

	/* 
	Ensure project/task radio buttons are disabled on reload if
	saved state of start button is disabled.
	*/
	var start_state = (JSON.parse(localStorage.getItem('buttonState')));
	if (start_state != null && start_state['start-button'] === true){
		$('input[name="project"]').attr('disabled', true);
		$('input[name="task"]').attr('disabled', true);
		/* change message from 'click start', to 'logging task' */
		$('#message').html('Logging task ... ');
		} else {
			$('#message').html("Click start when you're ready to work!");
	}
});

/*
| Document Ready End
|__________________________________


| Display Functions
|----------------------------------
*/

/* 
Constuctor for a task duration object 
Note 'exported Task_duration' tells jshint that the constructor is to be used elsewhere
thus avoiding an 'is defined but never used' warning.
*/

/* exported Task_duration */
function Task_duration(project, task, date_completed, duration){
	this.project = project;
	this.task = task;
	this.date_completed = date_completed;
	this.duration = duration;
}

/* 
	Rebuild stats table whenever a task is finished.
	If tasks_logged is empty, show message, otherwise show logs.
	Tasks_logged is reversed to show most recently completed at the top.
*/
function populate_stats_table(tasks_logged) {	
	if (tasks_logged != null) {
		var t = "";
		$.each(tasks_logged.reverse(), function(i, val) {
			var m = "min";
			if (val.duration > 1){
				m = "mins";
			}
			t += '<tr><td>'+moment(val.date_completed).format('MMM Do HH:mm')+'</td><td>'+val.project+'</td><td>'+val.task+'</td><td>'+val.duration+' '+m+'</td></tr>';
		});
		$('#stats-table tbody').html(t);
	} else {
		$('#stats-table tbody').html('<tr><td colspan="4" style="text-align:center">No tasks completed today</td></tr>');
	}
}

/*
	Find unique tasks completed in order to manipulate further.
	This could run into problems if tasks for two different projects were
	given the same name.
	(with credit to georg: https://stackoverflow.com/a/9229821).
*/
function unique_tasks(tasks_logged){
	var seen = {};
	var unique = [];
	var len = tasks_logged.length;
	var j = 0;
	for(var i = 0; i < len; i++) {
		var item = tasks_logged[i].task;
		if(seen[item] !== 1) {
			seen[item] = 1;
			unique[j++] = item;
		}
	}
	return unique;   
}

/*
	Retrieve unique tasks, then calculate total duration spent on each task.
	Push this task and duration, along with it's project to a total_task_durations
	array.
*/
function aggregate_stats(tasks_logged){
	if (tasks_logged != null) {
		var tasks = unique_tasks(tasks_logged);
		var duration = 0;
		var project = '';
		var total_task_durations = [];
		for(var i = 0; i < tasks.length; i++){
			for(var j = 0; j < tasks_logged.length; j++){
				if (tasks[i] == tasks_logged[j].task){
					duration += tasks_logged[j].duration;
					project = tasks_logged[j].project;
				}
			}		
			total_task_durations.push([tasks[i], project, duration]);
			duration = 0;
			project = '';
		}
		populate_stats_aggregated_table(total_task_durations);
	} else {
		$('#aggregated-table').hide();
	}
}

/*
	Receive array of total durations (along with associated tasks and projects)
	and sort from greatest to smallest.
	Pass to HTML.
	This fought me far more than it should, so ignored JQuery and went for 
	a straight logical if :-/.
*/
function populate_stats_aggregated_table(total_task_durations) {	
	total_task_durations.sort(function(x, y){
		if (x[2] == y[2]) { 
			return 0; 
		}
		if (x[2] < y[2]) {
			return 1;
		} else {		        
			return -1;
		}
	});

	var t = "<tr><th>Task</th><th>Project</th><th>Total Time Spent</th></tr>";
	
	$.each(total_task_durations, function(i, val) {
		var m = "min";
		if (val[2] > 1){
			m = "mins";
		}
		t += '<tr><td>'+ val[0] +'</td><td>'+ val[1] +'</td><td>'+ val[2] + ' ' + m + '</td></tr>';
	});		
	$('#aggregated-table tbody').html(t);
}

/*
| Display Functions End
|_________________________________*/



