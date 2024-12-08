let list = document.getElementById("to-do-list");

function createEvent(inputText, dateInput, timeInput, isChecked = false) {
    let event = document.createElement("div");
    event.className = "event";
    event.id = "event";

    event.innerHTML = `
        <div class="check">
            <input type="checkbox" class="checkbox-eliminate" ${isChecked ? 'checked' : ''}>
        </div>
        <button class="trash-button"><i class="fa fa-trash"></i></button>
        <div class="details">
            ${inputText}
        </div>
        <div class="day">
            ${dateInput}
        </div>
        <div class="time">
            ${timeInput}
        </div>
    `;

    let eliminate = event.querySelector(".trash-button");
    eliminate.addEventListener("click", function(){
        eliminate.parentNode.remove();
        saveListToLocalStorage();
    });


    let checkbox = event.querySelector(".checkbox-eliminate");
    
    checkbox.addEventListener('click', function(e){
        e.stopPropagation();
        checkbox.checked = !checkbox.checked;
        if(checkbox.checked){
            event.style.border = "5px solid red";
        } else {
            event.style.border = "5px solid black";
        }
        saveListToLocalStorage();
    });

    event.addEventListener('click', function(e){
        if (!e.target.classList.contains('details') && 
            !e.target.classList.contains('details-edit') &&
            !e.target.classList.contains('day') &&
            !e.target.classList.contains('time')) {
            checkbox.checked = !checkbox.checked;
            if(checkbox.checked){
                event.style.border = "5px solid red";
            } else {
                event.style.border = "5px solid black";
            }
            saveListToLocalStorage();
        }
    });


    function addEditability(element, inputType = 'text') {
        element.addEventListener('dblclick', function editHandler(e) {
            e.stopPropagation(); 
            

            let input = document.createElement('input');
            input.type = inputType;
            input.className = 'details-edit';
            

            if (element.classList.contains('day') || element.classList.contains('time')) {
                input.style.width = '100px';
            }

            if (inputType === 'date') {

                input.value = element.textContent.trim();
            } else if (inputType === 'time') {

                input.value = element.textContent.trim();
            } else {
                input.value = element.textContent.trim();
            }

            element.parentNode.replaceChild(input, element);
            input.focus();
            
            function handleEdit() {
                let value = input.value.trim();
                if (value) {
                    let newElement = document.createElement('div');
                    newElement.className = element.className;
                    
                    if (inputType === 'date') {

                        newElement.textContent = value;
                    } else if (inputType === 'time') {

                        newElement.textContent = value;
                    } else {
                        newElement.textContent = value;
                    }
                    
                    addEditability(newElement, inputType);
                    
                    input.parentNode.replaceChild(newElement, input);
                    saveListToLocalStorage();
                }
            }
            
            input.addEventListener('blur', handleEdit);
            input.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    handleEdit();
                }
                if (e.key === 'Escape') {
                    input.value = element.textContent.trim();
                    input.blur();
                }
            });
        });
    }

    addEditability(event.querySelector(".details"), 'text');
    addEditability(event.querySelector(".day"), 'date');
    addEditability(event.querySelector(".time"), 'time');

    if (checkbox.checked) {
        event.style.border = "5px solid red";
    }

    return event;
}

function isInputField(element) {
    return element.tagName === 'INPUT' || 
           element.tagName === 'TEXTAREA' || 
           element.contentEditable === 'true';
}

function toggleItemBorder(checkbox, selected) {
    const parentContainer = checkbox.parentNode.parentNode;
    checkbox.checked = selected;
    parentContainer.style.border = selected ? "5px solid red" : "5px solid black";
}


function handleBulkSelection(checkboxes) {
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => toggleItemBorder(checkbox, !allChecked));
    saveListToLocalStorage();
}


document.addEventListener("keydown", function(event) {
    try {

        if (isInputField(document.activeElement)) {
            return;
        }

        if (event.key === "Backspace" || event.key === "Delete") {
            const removeButton = document.getElementById("remove-checked");
            if (removeButton) {
                removeButton.click();
            } else {
                console.warn("Remove button not found");
            }
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
            event.preventDefault();
            
            const checkboxes = document.querySelectorAll(".checkbox-eliminate");
            if (checkboxes.length > 0) {
                handleBulkSelection(checkboxes);
            } else {
                console.warn("No checkboxes found with class 'checkbox-eliminate'");
            }
        }
    } catch (error) {
        console.error("Error in keyboard event handler:", error);
    }
});

if (document.getElementById("insert-button") && document.getElementById("input-box")) {
    document.getElementById("input-box").addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            document.getElementById("insert-button").click();
        }
    });

    document.getElementById("date-box").addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            document.getElementById("insert-button").click();
        }
    });

    document.getElementById("insert-button").addEventListener('click', function () {
        let inputText = document.getElementById("input-box").value;
        let dateInput = document.getElementById("date-box").value;
        let timeInput = document.getElementById("time-box").value;
        document.getElementById("input-box").value = "";
        
        if(!inputText.trim()){
            return;
        }
        
        if (!dateInput.trim()) {
            let currentDate = new Date();
            dateInput = currentDate.toISOString().split('T')[0];
        }
        
        if (!timeInput.trim()) {
            let currentTime = new Date();
            timeInput = currentTime.toTimeString().split(' ')[0].slice(0, 5);
        }

        let event = createEvent(inputText, dateInput, timeInput);
        list.appendChild(event);
        saveListToLocalStorage();
    });
}

document.getElementById("eliminate-all").onclick = function (){
    let elements = list.querySelectorAll("#event");
    for(let i = 0; i < elements.length; i++){
        elements[i].remove();
    }
    saveListToLocalStorage();
}

document.getElementById("remove-checked").onclick = function(){
    let boxes = list.querySelectorAll("input[type=checkbox]");
    for(let i = 0; i < boxes.length; i++){
        if(boxes[i].checked){
            boxes[i].parentNode.parentNode.remove();
        }
    }
    saveListToLocalStorage();
}

document.addEventListener("DOMContentLoaded", function (){
    loadListFromLocalStorage();
});

function saveListToLocalStorage() {
    let events = [];
    document.querySelectorAll("#to-do-list .event").forEach(event => {
        events.push({
            text: event.querySelector(".details").innerText,
            date: event.querySelector(".day").innerText,
            time: event.querySelector(".time").innerText,
            checked: event.querySelector(".checkbox-eliminate").checked
        });
    });
    localStorage.setItem("list", JSON.stringify(events));
}

function loadListFromLocalStorage() {
    let storedEvents = localStorage.getItem("list");
    if (storedEvents) {
        JSON.parse(storedEvents).forEach(eventData => {
            let event = createEvent(eventData.text, eventData.date, eventData.time, eventData.checked);
            list.appendChild(event);
        });
    }
}