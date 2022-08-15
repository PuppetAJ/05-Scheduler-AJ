// Global variable declarations
var tasks = [];
var currentDate = moment().local().format("dddd, MMMM Do");
var dayEl = $("#currentDay");
var containerEl = $(".container");

// Sets element in header's text to current date
dayEl.text(currentDate);

// "Clear All" button's logic
var clearTasks = function() {

    // Creates temporary array
    var tempTasks = [];

    /* 
    Since the tasks array is given a number of objects to represent each time row
    displayed on the page, we can iterate through it starting from 0, and select
    each row element's ID and set the text content to be empty.
    
    Then, we set up an object to represent the row's new data and push it to our temporary array

    Lastly, we set our tasks array to equal the temporary array so that we can save the tasks in the format we desire
    (as an array of x length objects)
    */

    for (i = 0; i < tasks.length; i++) {
        $("#" + i).val("");

        var rowEl = {
            text: "",
            id: i
        }

        tempTasks.push(rowEl);
        
    }

    tasks = tempTasks;
    saveTasks();
}

// Adds "clearTasks" function to the "Clear All" button as a click event listener
$("#clear").click(clearTasks);

// Save button logic
var saveBtn = function() {
    // Gets the id of the closest textarea element to the save button
    var id = $(this).closest(".time-block").find(".tasks").attr('id');

    // Gets the text of the closest textarea element to the save button, and trims it
    var textEl = $(this).closest(".time-block").find(".tasks").val().trim();

    // Replaces the text of the corresponding rowEl object with the new text inputted by the user
    tasks[id].text = textEl.toString();

    // Calls the saveTasks function
    saveTasks();
};

// Save Tasks logic
var saveTasks = function() {
    // Stringifies the tasks array and sets it to localstorage, accessible by a key of "tasks"
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Load tasks logic
var loadTasks = function() {

    // Sets variable equal parsed localStorage content
    var parsedTasks = JSON.parse(localStorage.getItem("tasks"));

    // If localStorage is empty, return
    if (!parsedTasks) {
        return false;
    // Otherwise, set the tasks array equal to parsed tasks
    } else {
        tasks = parsedTasks;

        // And loop through the length of the tasks array, setting each row equal to the corresponding array index's content
        for (i = 0; i < tasks.length; i++) {
            var tempID = tasks[i].id;
            var tempText = tasks[i].text;
    
            var rowEl = $("#" + tempID);
            
            rowEl.val(tempText);
    
        }
    
    }

};


// Row constructor logic
var rowConstructor = function() {

    // Loops through 9 times, generating each row element and its children
    for (i = 9; i < 18; i++) {

        // Uses the i varaiable to set the hour using moment.js
        var elementHour = moment().hour(i).format();
        // Gets current hour
        var currentHour = moment().format();

        // Gets hour according to our loop and formats it to display as "9AM, 10AM, etc.."
        var hourText = moment().hour(i).format("hA");

        // Declares elements with classes and relevant id's
        var divEl = $("<div>", {"class": "time-block row"});
        // Substract 9 from ID so that it starts from 0, allowing us to use it later with our array
        var textAreaEl = $("<textarea>", {id: i - 9, "class": "col-10 past tasks"});
        var divEl2 = $("<div>", {"class": "saveBtn col-1 d-flex align-items-center justify-content-center"});
        var iEl = $("<i>", {"class": "fa-solid fa-floppy-disk save-icon"});
        var pEl = $("<p>", {"class": "text-right hour p-2 col-1"});

        // Sets textcontent of the newly generated p element to the corresponding hour (starting from 9 am, ends at 5pm)
        pEl.text(hourText);

        // Past, present, and future logic
        // Adds / removes classes depending on whether or not the row's hour is before, during or after the current hour
        if (moment(currentHour).isBefore(elementHour, 'hour')) {
            textAreaEl.removeClass("past", "present");
            textAreaEl.addClass("future");
        } else if (moment(currentHour).isAfter(elementHour, 'hour')) {
            textAreaEl.removeClass("future","present");
            textAreaEl.addClass("past");
        } else {
            textAreaEl.removeClass("future", "past");
            textAreaEl.addClass("present");
        }

        // Appends elements
        divEl.append(pEl);
        divEl.append(textAreaEl);
        divEl.append(divEl2);
        divEl2.append(iEl);

        // Creates a row object set to the textArea element's id and text
        // This is used to format our array
        var rowEl = {
            text: textAreaEl.val(),
            id: textAreaEl.attr('id')
        }

        // Pushes these row objects to the array, causing it to alway be the length of our rows, allowing us to modify the length later without breaking functionality
        tasks.push(rowEl);

        // Appends the row
        containerEl.append(divEl);
    }

    // Iterates through each icon with the .save-icon class and gives it a click event listener that calls the saveBtn function
    $(".save-icon").each(function() {
        $(this).click(saveBtn);
    })

};

// Constructs the rows BEFORE loading tasks
// This is so that we can load our save tasks onto the corresponding rows. if we tried to load before constructing our rows, it wouldn't be able to place them in the proper position
rowConstructor();
loadTasks();