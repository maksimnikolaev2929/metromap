
let fromSelected = null;
let toSelected = null;


function generateRoute() {
    return;
}

function stationSelect(id) {
    if ((fromSelected == id) || (toSelected == id)) {
        return;
    }
    if (fromSelected === null) {
        fromSelected = id;
        generateRoute();
        return;
    }
    toSelected = id;
    generateRoute();
}

