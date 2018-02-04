
/* 
	ensure project/task are selected from radio buttons.
	store the start time to localStorage. 
	handle button states.
*/
$(function(){
	$('#start-button').click(function(){

		// first check to ensure that project and task are set
		if (!$('input[name=task]:checked').length > 0)  {
			alert('Ensure you have selected a Project and a Task');
		} else {
			start_time = new Date();  
			localStorage.setItem('start_time', start_time);   
			$('#start-button').attr('disabled', true);
			$('#finish-button').attr('disabled', false);    
			// console.log('start: ' + start_time);   
			// console.log(JSON.parse(localStorage.getItem('buttonState')));
			
			/* disable radio buttons so that project/task can't be changed once initiated */			
			$('input[name="project"]').attr('disabled', true);
			$('input[name="task"]').attr('disabled', true);	
		}
	});
});

/* 
	store the finish time to localStorage.
	create new task_duration object and add to stringified array.
	populate the stats_table with parsed array.
	handle button states.
*/
$(function(){
	$('#finish-button').click(function(){
		finish_time = new Date();  
		localStorage.setItem('finish_time', finish_time);
		$('#finish-button').attr('disabled', true);
		$('#start-button').attr('disabled', false);	
		// console.log('finish: ' + finish_time);
		// console.log(JSON.parse(localStorage.getItem('buttonState')));

		/* set current task variables */
		var project = $('input[name=project]:checked').val();
		var task = $('input[name=task]:checked').val();
		var date_completed = finish_time;
		var duration = Math.ceil((Date.parse(localStorage.finish_time)-Date.parse(localStorage.start_time))/60000);
		// console.log(project, task, date_completed, duration);

		/* create new duration object */
		new_task = new task_duration(project, task, date_completed, duration);
		// console.log(new_task);

		/* save to localStorage (checking first if there exists an array already) */
		tasks_logged = JSON.parse(localStorage.getItem('task_logged')) || [];
		tasks_logged.push(new_task);
		localStorage.setItem('task_logged', JSON.stringify(tasks_logged));
		// console.log(tasks_logged);

		/* parse JSON and populate stats_table from localStorage */
		var temp = JSON.parse(localStorage.getItem('task_logged'));				
		populate_stats_table(temp);

		/* something cool */
		aggregate_stats(temp);

		/* re-enable radio buttons for project/task selection */
		$('input[name="project"]').attr('disabled', false);
		$('input[name="task"]').attr('disabled', false);	
	});
});	

/* clear nested task radio buttons if another project is selected */
$(function(){
	$('input[name="project"]').change(function(){
		$('input[name="task"]').prop('checked', false);								
	});
});

/*
|----------------------------------
| Admin functions for testing
|----------------------------------
*/

/* calculate and display duration based on start and finish times in localStorage */
$(function(){
	$('#retrieve-duration').click(function(){
		duration = Math.ceil((Date.parse(localStorage.finish_time)-Date.parse(localStorage.start_time))/60000);
		console.log("Most recent duration: " + duration + " mins");
	});
});	

/* clear localStorage array of tasks_logged */
$(function(){
	$('#clear-tasks_logged').click(function(){
		localStorage.removeItem("task_logged");
		populate_stats_table(JSON.parse(localStorage.getItem('task_logged')));
		console.log("tasks_logged cleared");
	});
});	

/* send current tasks_logged array to console.log */
$(function(){
	$('#display-tasks_logged').click(function(){				
		console.log(JSON.parse(localStorage.getItem('task_logged')) || {});
	});
});	

/* clear localStorage */
$(function(){
	$('#clear-localStorage').click(function(){	
		localStorage.clear();			
		console.log('localStorage cleared');
	});
});	


		



