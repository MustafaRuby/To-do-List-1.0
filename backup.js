document.getElementById("backup-text-button").addEventListener("click", function(){
    let storedEvents = localStorage.getItem("list");
    document.getElementById("information-box").innerHTML = storedEvents;
});

document.getElementById("backup-button").addEventListener("click", function(){
    let flag = true;
    let list = JSON.parse(document.getElementById("backup-box").value);
    let events = JSON.parse(localStorage.getItem("list"));

    events.forEach(element => {

        if(!element.text || !element.date || !element.time){
            console.log("h")
            flag = false;
            return
        }
        list.push(element);
    });

    if(!flag){
        return;
    }
    
    localStorage.setItem("list", JSON.stringify(list));
});