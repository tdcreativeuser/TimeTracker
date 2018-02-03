/* ensure that stats table is populated by any existing logged tasks on page load */
$(document).ready(function(){
	populate_stats_table(JSON.parse(localStorage.getItem('task_logged')));
});

/* 
	reubild stats table whenever a task is finished.
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