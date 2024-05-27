let list = document.getElementById("to-do-list");

document.addEventListener("keydown", function(event){
    if(event.key === "Backspace" || event.key === "Delete"){
        document.getElementById("remove-checked").click();
    }
    if(event.ctrlKey && event.key === "a"){
        event.preventDefault();
        var checkboxes = document.querySelectorAll(".checkbox-eliminate");
        
        var allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

        if(allChecked){
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.parentNode.parentNode.style.border = "5px solid black";
            });
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                checkbox.parentNode.parentNode.style.border = "5px solid red";
            });
        }
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
        if(!inputText.trim()){
            return;
        }
        if (!dateInput.trim()) {
            let currentDate = new Date();
            let formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            dateInput = formattedDate;
        }

        let event = document.createElement("div");
        event.className = "event";
        event.id = "event";

        event.innerHTML = `
            <div class="check">
                <input type="checkbox" class="checkbox-eliminate">
            </div>
            <button class="trash-button"><i class="fa fa-trash"></i></button>
            <div class="details">
                ${inputText}
            </div>
            <div class="day">
                ${dateInput}
            </div>
        `;

        let eliminate = event.querySelector(".trash-button");
        eliminate.addEventListener("click", function(){
            eliminate.parentNode.remove();
            saveListToLocalStorage();
        });

        let checkbox = event.querySelector(".checkbox-eliminate");

        checkbox.addEventListener('click', function(){
            checkbox.checked = !checkbox.checked;
            if(checkbox.checked){
                event.style.border = "5px solid red";
            }
            else{
                event.style.border = "5px solid black";
            }
        });

        event.addEventListener('click', function(){
            checkbox.checked = !checkbox.checked;
            if(checkbox.checked){
                event.style.border = "5px solid red";
            }
            else{
                event.style.border = "5px solid black";
            }
        });

        list.appendChild(event);
        saveListToLocalStorage();
    });
} else {
    console.error("Elements 'insert-button' or 'input-box' not found.");
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

document.getElementById("information-button").onclick = function(){
    alert(`Hi! This is your own to do list app, here's how you can use it.\n\nEvent insertion:\nTo insert you write the details about the event you want to plan (if you don't insert any details, you will not be able to insert any event), then you can add a date to your plan, if you don't, it'll automatically set the date to the day you inserted it on.\n\nTo add an event to the list, you can click the "Add event" button, or click "Enter" while in the input or date feild.\n\nList use:\nTo check events that you already completed, either click on the checkbox or the event itself.\n\nTo eliminate the events you checked you can either click the "Remove checked events" buttons or simply press the "Backspace" or "delete" key.\n\nTo check all the elements simply press "Ctrl+A".\n\nTo clear the list click the "Clear list" button.\n\n`);
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
            checked: event.querySelector(".checkbox-eliminate").checked
        });
    });
    localStorage.setItem("list", JSON.stringify(events));
}

function loadListFromLocalStorage() {
    let storedEvents = localStorage.getItem("list");
    if (storedEvents) {
        JSON.parse(storedEvents).forEach(eventData => {
            let event = document.createElement("div");
            event.className = "event";
            event.id = "event";
            
            event.innerHTML = `
                <div class="check">
                    <input type="checkbox" class="checkbox-eliminate" ${eventData.checked ? 'checked' : ''}>
                </div>
                <button class="trash-button"><i class="fa fa-trash"></i></button>
                <div class="details">
                    ${eventData.text}
                </div>
                <div class="day">
                    ${eventData.date}
                </div>
            `;

            let eliminate = event.querySelector(".trash-button");
            eliminate.addEventListener("click", function(){
                eliminate.parentNode.remove();
                saveListToLocalStorage();
            });

            let checkbox = event.querySelector(".checkbox-eliminate");

            checkbox.addEventListener('click', function(){
                checkbox.checked = !checkbox.checked;
                if(checkbox.checked){
                    event.style.border = "5px solid red";
                }
                else{
                    event.style.border = "5px solid black";
                }
                saveListToLocalStorage();
            });

            event.addEventListener('click', function(){
                checkbox.checked = !checkbox.checked;
                if(checkbox.checked){
                    event.style.border = "5px solid red";
                }
                else{
                    event.style.border = "5px solid black";
                }
                saveListToLocalStorage();
            });

            if (checkbox.checked) {
                event.style.border = "5px solid red";
            } else {
                event.style.border = "5px solid black";
            }

            list.appendChild(event);
        });
    }
}
