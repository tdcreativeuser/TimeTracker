# TimeTracker
HTML/CSS/JavaScript web interface for keeping track of time spent performing a given task on a specific project.

## About
From the brief: The client wants to be able to enter time but doesn’t want to have to use a traditional dropdown menu with hours and minutes to enter time, nor do they want to have to type the time they started and the time they finished. 

The interface supports persistent states and logging of time. A constraint was no use of server-side languages, so ```localstorage``` is employed. 

## Deployment and Usage

Clone repository with ```https://github.com/xataraxiax/TimeTracker.git```

Simply load ```time_tracker.html``` into your favourite browser (so long as that doesn't happen to be IE! - see below). 

The interface works as intended under Chrome (63.0.3239.132) and Firefox (48.02) on Windows 7, and Chrome (53.0.2785.92) and Firefox (48.0) on Linux Mint 17.2. It does **NOT** work on IE 11, unless hosted on a server, due to problems accessing ```localstorage```.

Minified **JQuery** and **Moment** libraries included so that the interface can be used offline.

### Notes on use

On loading the page you are presented with a list of **Projects** and related **Tasks** to choose. These are hard-coded examples for now, but would ultimately be generated dynamically based on user input.

Select a **Project** to work on, then select a **Task**. Both must be selected before the interface will allow you to click the **Start** button.

Once these are selected, click **Start** and the interface will log your start time. The **Start** button will now be disabled, as will the radio selectors. This state will persist through browser close and refresh.

When the task is completed, simply click the **Finish** button for the task and duration to be logged at the head of the **Recent Logs table**.

Once this list is populated, a second table showing total time spent on each task will be populated. This calculates the accumulated duration, and presents a summary in decending order of duration.

At the right in the main banner, there is a **clear tasks_logged** button, which clears all tasks from ```localstorage``` and resets for a clean slate. When less than 480px, this transforms into a round button with no text to conserve space. It would probably be worth using JQuery to switch in a different button that was more informative about its task.

## Problems

The interface does not work at all under IE 11 (11.0.9600.18665). Simply clicking the **Start** button freezes IE and the console logs: ```jQuery.Deferred exception: Unable to get property 'getItem' of undefined or null reference```. This is the result of a known problem with IE, in that it cannot access ```localstorage``` without the help of a server. See https://stackoverflow.com/a/21372954. If the interface is hosted locally using WAMPServer, it behaves (largely) as expected under IE.

In IE there are issues with the ```<fieldset>```/```<legend>``` tags, which causes the ```<legend>``` to be displayed inside the fieldset, thereby adversly effecting the project/task radio button positions. There are workarounds to this such as wrapping the ```<form>``` element in an empty ```<div>```, but I chose not to follow through for now.

A minor quirk is that under Firefox and WAMP hosted IE, the tables do not quite align. This is Chrome's fault (or mine actually), since I had to add a 8px left margin to the bottom table to get them to line up in my Chrome testing environment. I simply couldn't see what was doing it, though it's bound to be something dumb.


## Future

Allow dynamic generation of **Projects** and **Tasks** based on user input.

It would be nice if the Recent Logs table was a fixed height, and imployed a y-axis scroll bar when excess entries were added. I spent a lot of time trying to implement this, but managed to break clean formatting each time.

It would also be useful if different criteria could be selected for the second table (say, only showing tasks on a certain day; showing days that a certain project or task were worked on; even trends as to time of day that activity was more frequent). These would all be quite trivial given access to the ```task_duration``` object, but care would have to be taken to ensure that the UI did not become cluttered.

More work could be done ensuring that mobile-first was a priority. Changing the layout of the tables (perhaps having columns that stacked) when the screen is shrunk to a certain size would be of great benefit.

It could also be worth exploring how to deploy the interface with an easily spun up local server (to solve the IE problem, and more correctly imitate a web-based interface).



## Author

Stefan Pedersen - February 2018
