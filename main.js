let list = document.getElementById("to-do-list");

document.addEventListener("keydown", function(event){
    if(event.key === "Backspace" || event.key === "Delete"){
        document.getElementById("remove-checked").click();
    }
    if(event.ctrlKey && event.key === "a"){
        event.preventDefault();
        var checkboxes = this.querySelectorAll(".checkbox-eliminate");
        
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
        })

        let checkbox = event.querySelector(".checkbox-eliminate");

        checkbox.addEventListener('click', function(){
            checkbox.checked =!checkbox.checked;
            if(checkbox.checked){
                event.style.border = "5px solid red";
            }
            else{
                event.style.border = "5px solid black";
            } 
        });

        event.addEventListener('click', function(){
            checkbox.checked =!checkbox.checked;
            if(checkbox.checked){
                event.style.border = "5px solid red";
            }
            else{
                event.style.border = "5px solid black";
            } 
        });

        list.appendChild(event);
    });
} else {
    console.error("Elements 'insert-button' or 'input-box' not found.");
}

document.getElementById("eliminate-all").onclick = function (){
    let elements = list.querySelectorAll("#event");
    for(let i = 0; i < elements.length; i++){
        elements[i].remove();
    }
}

document.getElementById("remove-checked").onclick = function(){
    let boxes = list.querySelectorAll("input[type = checkbox]");
    for(let i = 0; i < boxes.length; i++){
        if(boxes[i].checked){
            boxes[i].parentNode.parentNode.remove();
        }
    }
}

