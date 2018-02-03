
		// store the start time to localStorage
		$(function(){
			$('#start-button').click(function(){

				//need to have checks here to ensure that project and task are set

				start_time = new Date();  
				localStorage.setItem('start_time', start_time);   
				$('#start-button').attr('disabled', true);
				$('#finish-button').attr('disabled', false);    
				console.log('start: ' + start_time);    

			});
		});

		// store the finish time to localStorage
		$(function(){
			$('#finish-button').click(function(){
				finish_time = new Date();  
				localStorage.setItem('finish_time', finish_time);
				$('#finish-button').attr('disabled', true);
				$('#start-button').attr('disabled', false);	
				console.log('finish: ' + finish_time);

				//set current task variables
				var project = $('input[name=project]:checked').val();
				var task = $('input[name=task]:checked').val();
				var date_completed = finish_time;
				var duration = Math.ceil((Date.parse(localStorage.finish_time)-Date.parse(localStorage.start_time))/60000);
				console.log(project, task, date_completed, duration);

				//reate new duration object
				new_task = new task_duration(project, task, date_completed, duration);
				console.log(new_task);

				// save to localStorage (checking first if there exists an array already)
				tasks_logged = JSON.parse(localStorage.getItem('task_logged')) || [];
				tasks_logged.push(new_task);
				localStorage.setItem('task_logged', JSON.stringify(tasks_logged));
				console.log(tasks_logged);

			});
		});		

		// calculate and display duration based on start and finish times in localStorage
		$(function(){
			$('#retrieve-duration').click(function(){
				duration = Math.ceil((Date.parse(localStorage.finish_time)-Date.parse(localStorage.start_time))/60000);
				$('#duration').text(duration + " mins");

			});
		});	

		// clear localStorage array of tasks_logged
		$(function(){
			$('#clear-tasks_logged').click(function(){
				localStorage.removeItem("task_logged");
				console.log("tasks_logged cleared");
			});
		});	

		// send current tasks_logged array to console.log
		$(function(){
			$('#display-tasks_logged').click(function(){				
				console.log(JSON.parse(localStorage.getItem('task_logged')) || []);
			});
		});	
		
		// clear nested task radio buttons if another project is selected
		$(function(){
			$('input[name="project"]').change(function(){
				$('input[name="task"]').prop('checked', false);								
			});
		});

		



