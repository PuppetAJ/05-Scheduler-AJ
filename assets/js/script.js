var tasks = [];
var now = moment().local().format("dddd, MMMM Do");
var dayEl = $("#currentDay");
dayEl.text(now);

var containerEl = $(".container");

var saveBtn = function() {
    var id = $(this).closest(".time-block").find(".tasks").attr('id');
    var textEl = $(this).closest(".time-block").find(".tasks").val().trim();

    console.log(textEl);
    console.log(id);

    tasks[id].text = textEl.toString();

    console.log(tasks);

    // THEN call saveTasks
}

var saveTasks = function() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

var loadTasks = function() {

}

var hourConstructor = function() {

    for (i = 9; i < 18; i++) {

        var elementHour = moment().hour(i).format();
        var currentHour = moment().format();

        var hourText = moment().hour(i).format("hA");

        var divEl = $("<div>", {"class": "time-block row"});
        var textAreaEl = $("<textarea>", {id: i-9, "class": "col-10 past tasks"});
        var divEl2 = $("<div>", {"class": "saveBtn col-1 d-flex align-items-center justify-content-center"});
        var iEl = $("<i>", {"class": "fa-solid fa-floppy-disk save-icon"});
        var pEl = $("<p>", {id: "hr" + i, "class": "text-right hour p-2 col-1"});
        pEl.text(hourText);

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

        divEl.append(pEl);
        divEl.append(textAreaEl);
        divEl.append(divEl2);
        divEl2.append(iEl);

        var textEl = {
            text: textAreaEl.val(),
            id: textAreaEl.attr('id')
        }

        tasks.push(textEl);

        containerEl.append(divEl);
    }

    $(".save-icon").each(function() {
        $(this).click(saveBtn);
    })

    

}

hourConstructor();

/* 
TO DO: 

- save button / load task logic
- comments and styling
- change pEl's ID to textarea for saving logic
- add event listeners to save button
- add buttons to clear all text?

*/