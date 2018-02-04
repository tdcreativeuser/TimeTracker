$(document).ready(function(){
	/*  Ensure that stats table is populated by any existing logged tasks on page load */
	populate_stats_table(JSON.parse(localStorage.getItem('task_logged')));

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
		console.log(JSON.parse(localStorage.getItem('buttonState')));
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
		}	
	});

/* 
	Constuctor for a task duration object 
	*/
	function task_duration(project, task, date_completed, duration){
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
			var t = "<tr><th>Date</th><th>Project</th><th>Task</th><th>Duration</th></tr>";
			$.each(tasks_logged.reverse(), function(i, val) {
				t += '<tr><td>'+moment(val.date_completed).format('MMMM Do YYYY')+'</td><td>'+val.project+'</td><td>'+val.task+'</td><td>'+val.duration+'</td></tr>';
			});
			$('#stats-table tbody').html(t);
		} else {
			$('#stats-table tbody').html('<tr><th>No tasks completed today</th></tr>');
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
		total_task_durations = total_task_durations.sort(function (a, b) {
			
		});
		console.log(total_task_durations);

		populate_stats_aggregated_table(total_task_durations);
	}

	function populate_stats_aggregated_table(total_task_durations) {	
		if (total_task_durations != null) {
			
			// $.each(total_task_durations, function(i, x) {
			// 	console.log('doogies' + x[2].sort());
			// });
			// console.log("dawg"+total_task_durations[0][2]);



			var t = "<tr><th>Task</th><th>Project</th><th>Total Time Spent</th></tr>";
			$.each(total_task_durations, function(i, val) {
				t += '<tr><td>'+ val[0] +'</td><td>'+ val[1] +'</td><td>'+ val[2] +'</td></tr>';
			});
			$('#aggregated-table tbody').html(t);
		} else {
			$('#aggregated-table tbody').html('<tr><th>No tasks completed today</th></tr>');
		}
	}



