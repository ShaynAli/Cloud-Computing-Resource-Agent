var current_vm = -1;
var vm_table, vm_list, vm_config;

function init() {

    vm_table = document.getElementById("vm-table");
    vm_list = document.getElementById("vm-list");
    vm_config = document.getElementById("vm-config");
    current_usage = document.getElementById("current-vm-usage");
    total_usage = document.getElementById("total-vm-usage");

    document.getElementById("stop-vm").disabled = true;
    vm_config.style.visibility = "hidden";

    document.getElementById("new-vm").addEventListener("click", function() {
        new_vm();
    });

    document.getElementById("start-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        start_vm(current_vm);
    });

    document.getElementById("stop-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        stop_vm(current_vm);
    });

    document.getElementById("delete-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        delete_vm(current_vm);
    });

    document.getElementById("upgrade-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        upgrade_vm(current_vm);
    });

    document.getElementById("downgrade-vm").addEventListener("click", function() {
        if (current_vm === -1) { 
            return;
        }
        downgrade_vm(current_vm);
    });
    
    // TODO: Loop to get VM cost update
}

function string_to_html(html_string) {
    var template = document.createElement("template");
    template.innerHTML = html_string.trim();
    return template.content.cloneNode(true);
}

function new_vm() {  
    console.log("creating vm");
    post("/createVM/").then(function (response) {
        var vm_id = response["VM"];
        console.log("Got VM id: " + vm_id)
        vm_table.appendChild(string_to_html(`
            <tr id="vm-` + vm_id + `">\n
                <td>` + vm_id + `</td>\n
                <td></td>\n
                <td>status</td>\n
                <td>config</td>\n
                <td>\n
                    <button id="select-vm-` + vm_id + `">select</button>\n
                </td>\n
            </tr>
        `));
        document.getElementById("select-vm-" + vm_id).addEventListener("click", function() {
            select_vm(vm_id);
        })
    });
}

function select_vm(id) {
    console.log("selecting vm " + id);
    vm_config.style.visibility = "visible";
    current_vm = id;
 }

function start_vm(id) {
    console.log("starting vm " + id);
    post("/startVM/" + id);
    document.getElementById("start-vm").disabled = true;
    document.getElementById("stop-vm").disabled = false;
}

function stop_vm(id) {
    console.log("stopping vm " + id);
    post("/stopVM/" + id);
    document.getElementById("start-vm").disabled = true;
    document.getElementById("stop-vm").disabled = true;
    document.getElementById("upgrade-vm").disabled = true;
    document.getElementById("downgrade-vm").disabled = true;
 }

function delete_vm(id) {
    console.log("deleting vm" + id);
    document.getElementById("vm-" + id).remove();
}

function upgrade_vm(id) {
    console.log("upgrading vm" + id);
    post("/upgradeVM/" + id);
}

function downgrade_vm(id) {
    console.log("downgrading vm" + id);
    post("/downgradeVM/" + id);
}

function update_vm_price(id) {
    console.log("updating price for vm " + id);
    // TODO
}

function update_vm_total_price() {
    console.log("downgrading total price");
    // TODO
}

function post(path, params, method) {

    var url = "https://cloud-computing-backend-gyoung52.c9users.io:8080/portal" + path;

    return fetch(url, {
        method: "POST",
        headers: new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json"
        }) 
    })
    .then(response => response.json());
}
