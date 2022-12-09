const metroAdjacency = {
    'line0_0': ['line0_1'],
    'line0_1': ['line0_0', 'line0_2', 'line2_2'],
    'line0_2': ['line0_1', 'line0_3'],
    'line0_3': ['line0_2', 'line0_4'],
    'line0_4': ['line0_3'],
    'line1_0': ['line1_1'],
    'line1_1': ['line1_0', 'line1_2'],
    'line1_2': ['line1_1', 'line1_3', 'line2_3'],
    'line1_3': ['line1_2', 'line1_4'],
    'line1_4': ['line1_3'],
    'line2_0': ['line2_1'],
    'line2_1': ['line2_0', 'line2_2'],
    'line2_2': ['line2_1', 'line2_3', 'line0_1'],
    'line2_3': ['line2_2', 'line2_4', 'line1_2'],
    'line2_4': ['line2_3', 'line2_5'],
    'line2_5': ['line2_4']
};

const stationNames = {
    'line0_0': 'Баррикадная',
    'line0_1': 'Пушкинская',
    'line0_2': 'Кузнецкий мост',
    'line0_3': 'Китай-город',
    'line0_4': 'Таганская',
    'line1_0': 'Киевская',
    'line1_1': 'Смоленская',
    'line1_2': 'Арбатская',
    'line1_3': 'Площадь революции',
    'line1_4': 'Курская',
    'line2_0': 'Менделеевская',
    'line2_1': 'Цветной бульвар',
    'line2_2': 'Чеховская',
    'line2_3': 'Боровицкая',
    'line2_4': 'Полянка',
    'line2_5': 'Серпуховская'
}

const timings = {
    'line0': [3, 2, 2, 3],
    'line1': [3, 2, 2, 3],
    'line2': [2, 2, 3, 2, 2]
}

const transferTimings = {
    'line0_1-line2_2': 4,
    'line1_2-line2_3': 4
}

const stationLoad = {
    'line0_1': .43,
    'line1_2': .67,
    'line2_2': .12,
    'line2_3': .83
}

let fromSelected = null;
let toSelected = null;

let trainStepsAmount = 0;
let transfersAmount = 0;

function addTrainRouteStep(trainFrom, trainTo, time) {
    if ((transfersAmount == 1) && (trainStepsAmount == 0)) {
        trainStepsAmount += 2;
    }
    else {
        trainStepsAmount += 1;
    }

    _id = 'sl__icon_from_' + trainStepsAmount;
    document.getElementById(_id).classList.add(trainFrom.slice(0, 5));
    _id = 'sl__icon_to_' + trainStepsAmount;
    document.getElementById(_id).classList.add(trainTo.slice(0, 5));

    _id = 'station_from_' + trainStepsAmount;
    document.getElementById(_id).textContent = stationNames[trainFrom];
    _id = 'station_to_' + trainStepsAmount;
    document.getElementById(_id).textContent = stationNames[trainTo];

    _id = 'train_time_' + trainStepsAmount;
    document.getElementById(_id).textContent = time + ' мин';

    _id = 'train_step' + trainStepsAmount;
    document.getElementById(_id).classList.remove('_hidden');
}

function addTransferRouteStep(transferFrom, transferTo, time, additionalTime, load) {
    transfersAmount += 1;

    _id = 'load_percent_t' + transfersAmount;
    document.getElementById(_id).innerHTML = load * 100 + "%";

    _id = 'loadindicator__circle_t' + transfersAmount;
    _id1 = 'loadindicator__lightning_t' + transfersAmount;
    _id2 = 'additional_time_t' + transfersAmount;
    if (load < .40) {
        document.getElementById(_id).style.fill = '#4D943B';
        document.getElementById(_id1).style.fill = '#FFFFFF';
        document.getElementById(_id2).style.color = '#4D943B';
    }
    else if (load < .70) {
        document.getElementById(_id).style.fill = '#EAD624';
        document.getElementById(_id1).style.fill = '#000000';
        document.getElementById(_id2).style.color = '#EAD624';
    }
    else {
        document.getElementById(_id).style.fill = '#D60303';
        document.getElementById(_id1).style.fill = '#FFFFFF';
        document.getElementById(_id2).style.color = '#D60303';
    }

    document.getElementById(_id2).textContent = '+' + additionalTime +' мин';

    _id = 'sl__icon_from_t' + transfersAmount;
    document.getElementById(_id).classList.add(transferFrom.slice(0, 5));
    _id = 'sl__icon_to_t' + transfersAmount;
    document.getElementById(_id).classList.add(transferTo.slice(0, 5));

    _id = 'station_from_t' + transfersAmount;
    document.getElementById(_id).textContent = stationNames[transferFrom];
    _id = 'station_to_t' + transfersAmount;
    document.getElementById(_id).textContent = stationNames[transferTo];

    _id = 'transfer_time_t' + transfersAmount;
    document.getElementById(_id).textContent = time + ' мин';

    _id = 'transfer_step' + transfersAmount;
    document.getElementById(_id).classList.remove('_hidden');
}

function showRouteDetails(route) {

    trainStepsAmount = 0;
    transfersAmount = 0;
    let stationCount = 1;
    let trainTime = 0;
    let totalTime = 0;

    for (i = 1; i < route.length; i++) {
        if (route[i - 1].charAt(4) != route[i].charAt(4)) {
            if (stationCount > 1) {
                totalTime += trainTime;
                addTrainRouteStep(route[i - stationCount], route[i - 1], trainTime);
                stationCount = 0;
                trainTime = 0;
            }
            if (route[i - 1].charAt(6) > route[i].charAt(6)) {
                transferId = route[i] + '-' + route[i - 1];
            }
            else {
                transferId = route[i - 1] + '-' + route[i];
            }

            transferTime = transferTimings[transferId];
            load = stationLoad[route[i - 1]];
            additionalTime = Math.floor(4 * load);
            transferTime += additionalTime;
            totalTime += transferTime;

            addTransferRouteStep(route[i - 1], route[i], transferTime, additionalTime, load);
            stationCount += 1;
            continue;
        }

        index = parseInt(route[i].charAt(6), 10);
        if (route[i].charAt(6) < route[i - 1].charAt(6)) {
            trainTime += timings[route[i].slice(0, 5)][index];
        }
        else {
            trainTime += timings[route[i].slice(0, 5)][index - 1];
        }

        if (i == (route.length - 1)) {
            totalTime += trainTime;
            addTrainRouteStep(route[i - stationCount], route[i], trainTime);
        }

        stationCount += 1;
    }
    
    document.getElementById('total_time').textContent = totalTime + ' мин';
    document.getElementById('route-info').classList.remove('_hidden');
}

function clearRouteDetails() {
    document.getElementById('transfer_step1').classList.add('_hidden');
    document.getElementById('transfer_step2').classList.add('_hidden');
    document.getElementById('train_step1').classList.add('_hidden');
    document.getElementById('train_step2').classList.add('_hidden');
    document.getElementById('train_step3').classList.add('_hidden');
    document.getElementById('route-info').classList.add('_hidden');
    document.getElementById('sl__icon_from_1').classList = '';
    document.getElementById('sl__icon_from_2').classList = '';
    document.getElementById('sl__icon_from_3').classList = '';
    document.getElementById('sl__icon_to_1').classList = '';
    document.getElementById('sl__icon_to_2').classList = '';
    document.getElementById('sl__icon_to_3').classList = '';
    document.getElementById('sl__icon_from_t1').classList = '';
    document.getElementById('sl__icon_from_t2').classList = '';
    document.getElementById('sl__icon_to_t1').classList = '';
    document.getElementById('sl__icon_to_t2').classList = '';
}

function findPath(start, visited = new Set(), route = new Array()) {
    visited.add(start);
    route.push(start);
    const destinations = metroAdjacency[start];
    for (const destination of destinations) {
        if (destination == toSelected) {
            route.push(destination);
            return route;
        }
        if (!visited.has(destination)) {
            result = findPath(destination, visited, route);
            if ((result === null) && (route.length != 1)) {
                route.pop()
            }
            else {
                return route;
            }
        }
    }
    return null;
}

function fadeAll() {
    var el = document.getElementById('main_map');
    var classList = 'classList' in el;
    for (var i = 0; i < el.children.length; i++) {
        var child = el.children[i];
        if (classList) {      
            child.classList.add('_faded');                                  
        } else {
        child.className += '_faded'
        }
    }  
}

function removeFade() {
    var el = document.getElementById('main_map');
    var classList = 'classList' in el;
    for (var i = 0; i < el.children.length; i++) {
        var child = el.children[i];
        child.classList.remove('_faded');
        child.classList.remove('_highlighted');
    }
}

function highlightRoute(route) {
    let highlighted = [...route];
    for (let i = 0; i < route.length; i++) {
        if (i != 0) {
            if (route[i - 1].charAt(6) > route[i].charAt(6)) {
                highlighted.push(route[i] + '-' + route[i - 1]);
            }
            else {
                highlighted.push(route[i - 1] + '-' + route[i]);
            }
        }
    }
    fadeAll();
    highlighted.forEach((id) => {
        document.getElementById(id).classList.add('_highlighted');
    })
}

function stationSelect(id) {
    if ((fromSelected == null) && (id != toSelected)){
        fromSelected = id;
        _classname = '_' + id.slice(0, 5);
        document.getElementById('from_remove').classList.add(_classname);
        document.getElementById("from_remove").value = stationNames[id];
    }
    else if ((toSelected == null) && (id != fromSelected)) {
        toSelected = id;
        _classname = '_' + id.slice(0, 5);
        document.getElementById('to_remove').classList.add(_classname);
        document.getElementById("to_remove").value = stationNames[id];
    }
    else {
        if ((id != toSelected) && (id != fromSelected)) {
            toSelected = id;
            _classname = '_' + id.slice(0, 5);
            document.getElementById('to_remove').classList.remove('_line0');
            document.getElementById('to_remove').classList.remove('_line1');
            document.getElementById('to_remove').classList.remove('_line2');
            document.getElementById('to_remove').classList.add(_classname);
            document.getElementById("to_remove").value = stationNames[id];
            clearRouteDetails();
            removeFade();
        }
    }
    if ((fromSelected != null) && (toSelected != null)) {
        route = findPath(fromSelected);
        highlightRoute(route);
        showRouteDetails(route);
    }
}

function removeHandler(id) {
    inputField = document.getElementById(id);
    inputField.classList.remove('_line0');
    inputField.classList.remove('_line1');
    inputField.classList.remove('_line2');
    if (id == 'from_remove') {
        inputField.value = 'Откуда';
        fromSelected = null;
    }
    else {
        inputField.value = 'Куда'
        toSelected = null;
    }
    removeFade();
    clearRouteDetails();
    document.getElementById('route-info').classList.add('_hidden');
}

// очень плохо
function swapStations() {
    if ((fromSelected != null) && (toSelected != null)) {
        [fromSelected, toSelected] = [toSelected, fromSelected];
        fromRemove = document.getElementById('from_remove');
        toRemove = document.getElementById('to_remove');

        fromRemove.classList.remove('_line0');
        fromRemove.classList.remove('_line1');
        fromRemove.classList.remove('_line2');
        toRemove.classList.remove('_line0');
        toRemove.classList.remove('_line1');
        toRemove.classList.remove('_line2');

        _classname = '_' + fromSelected.slice(0, 5);
        fromRemove.classList.add(_classname);
        fromRemove.value = stationNames[fromSelected];

        _classname = '_' + toSelected.slice(0, 5);
        toRemove.classList.add(_classname);
        toRemove.value = stationNames[toSelected];

        removeFade();
        clearRouteDetails();

        route = findPath(fromSelected);
        highlightRoute(route);
        showRouteDetails(route);
    }
}