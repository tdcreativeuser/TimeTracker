$(document).ready(function(){
	/* ensure that stats table is populated by any existing logged tasks on page load */
	populate_stats_table(JSON.parse(localStorage.getItem('task_logged')));

	/* 
		persist radio state in local storage 
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
		persist start and finish buttons.
	*/
	var buttonState = JSON.parse(localStorage.getItem('buttonState')) || {},
	$buttons = $("#button-container :button");
	$buttons.click(function(){		
		$buttons.each(function(){
			buttonState[this.id] = this.disabled;
		});
		localStorage.setItem("buttonState", JSON.stringify(buttonState));
	});

	$.each(buttonState, function(key, value) {
		$("#" + key).attr('disabled', value);
	});

	/* 
		ensure project/task radio buttons are disabled on reload if
		saved state of start button is disabled.
	*/
	var start_state = (JSON.parse(localStorage.getItem('buttonState')));
	if (start_state != null && start_state['start-button'] === true){
		$('input[name="project"]').attr('disabled', true);
		$('input[name="task"]').attr('disabled', true);
	}	
});

/* 
	constuctor for a task duration object 
*/
function task_duration(project, task, date_completed, duration){
	this.project = project;
	this.task = task;
	this.date_completed = date_completed;
	this.duration = duration;
}

/* 
	rebuild stats table whenever a task is finished.
	if tasks_logged is empty, show message, otherwise show logs.
	tasks_logged is reversed to show most recently completed at the top.
*/
function populate_stats_table(tasks_logged) {	
	if (tasks_logged != null) {
		var t = "<tr><th>Date</th><th>Project</th><th>Task</sub></th><th>Duration</th></tr>";
		$.each(tasks_logged.reverse(), function(i, val) {
			t += '<tr><td>'+moment(val.date_completed).format('MMMM Do YYYY')+'</td><td>'+val.project+'</td><td>'+val.task+'</td><td>'+val.duration+'</td></tr>';
		});
		$('#stats-table tbody').html(t);
	} else {
		$('#stats-table tbody').html('<tr><th>No tasks completed today</th></tr>');
	}
}