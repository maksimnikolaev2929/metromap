document.addEventListener("DOMContentLoaded", pageLoad);

const metroGraph = {
    line0_0: {line0_1: 3},
    line0_1: {line0_0: 3, line0_2: 3},
    line0_2: {line0_1: 3, line0_3: 3},
    line0_3: {line0_2: 3, line0_4: 2},
    line0_4: {line0_3: 2, line0_5: 2},
    line0_5: {line0_4: 2, line0_6: 3},
    line0_6: {line0_5: 3, line0_7: 2, line2_2: 4},
    line0_7: {line0_6: 2, line0_8: 2, line3_3: 4},
    line0_8: {line0_7: 2, line0_9: 3},
    line0_9: {line0_8: 3},
    line1_0: {line1_1: 3},
    line1_1: {line1_0: 3, line1_2: 2},
    line1_2: {line1_1: 2, line1_3: 2, line2_3: 4, line3_5: 5},
    line1_3: {line1_2: 2, line1_4: 3, line3_4: 10},
    line1_4: {line1_3: 3},
    line2_0: {line2_1: 2},
    line2_1: {line2_0: 2, line2_2: 2},
    line2_2: {line2_1: 2, line2_3: 3, line0_6: 4},
    line2_3: {line2_2: 3, line2_4: 2, line1_2: 4, line3_5: 6},
    line2_4: {line2_3: 2, line2_5: 2},
    line2_5: {line2_4: 2},
    line3_0: {line3_1: 2},
    line3_1: {line3_0: 2, line3_2: 2},
    line3_2: {line3_1: 2, line3_3: 2},
    line3_3: {line3_2: 2, line3_4: 2, line0_7: 4},
    line3_4: {line3_3: 2, line3_5: 2, line1_3: 10},
    line3_5: {line3_4: 2, line3_6: 2, line1_2: 5, line2_3: 6},
    line3_6: {line3_5: 2, line3_7: 2},
    line3_7: {line3_6: 2}
};

const stationNames = {
    'line0_0': 'Щукинская',
    'line0_1': 'Октябрьское поле',
    'line0_2': 'Полежаевская',
    'line0_3': 'Беговая',
    'line0_4': 'Улица 1905 года',
    'line0_5': 'Баррикадная',
    'line0_6': 'Пушкинская',
    'line0_7': 'Кузнецкий мост',
    'line0_8': 'Китай-город',
    'line0_9': 'Таганская',
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
    'line2_5': 'Серпуховская',
    'line3_0': 'Комсомольская',
    'line3_1': 'Красные ворота',
    'line3_2': 'Чистые пруды',
    'line3_3': 'Лубянка',
    'line3_4': 'Охотный ряд',
    'line3_5': 'Библиотека им. Ленина',
    'line3_6': 'Кропоткинская',
    'line3_7': 'Парк культуры'
}

let stationLoad = {}
const transferStations = ['line0_6', 'line0_7', 'line1_2', 'line1_3', 'line2_2', 'line2_3', 'line3_3', 'line3_4', 'line3_5']

const loadByTime = {
    '0': [0, .1],
    '1': [0, 0],
    '2': [0, 0],
    '3': [0, 0],
    '4': [0, 0],
    '5': [0, .2],
    '6': [.2, .4],
    '7': [.6, 1],
    '8': [.5, .9],
    '9': [.4, .7],
    '10': [.3, .5],
    '11': [.2, .4],
    '12': [.1, .2],
    '13': [.1, .2],
    '14': [.2, .3],
    '15': [.3, .4],
    '16': [.3, .4],
    '17': [.4, .6],
    '18': [.6, 1],
    '19': [.5, .7],
    '20': [.3, .5],
    '21': [.1, .3],
    '22': [0, .2],
    '23': [0, .1],
}

let fromSelected = null;
let toSelected = null;

let trainStepsAmount = 0;
let transfersAmount = 0;

function pageLoad() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('hour') == null || urlParams.get('minute') == null) {
        const now = new Date(Date.now());
        const hour = now.getHours();
        const minute = now.getMinutes();
        document.location.search = `hour=${hour}&minute=${minute}`;
    }
    fakeDataBase();
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function fakeDataBase() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const hour = urlParams.get('hour');
    const minute = urlParams.get('minute');
    transferStations.forEach((element) => {
        stationLoad[element] = getRandomArbitrary(loadByTime[hour][0], loadByTime[hour][1]);
    });

    metroGraph['line0_6']['line2_2'] += Math.floor(4 * stationLoad['line0_6']);

    metroGraph['line0_7']['line3_3'] += Math.floor(4 * stationLoad['line0_7']);

    metroGraph['line1_2']['line2_3'] += Math.floor(4 * stationLoad['line1_2']);
    metroGraph['line1_2']['line3_5'] += Math.floor(4 * stationLoad['line1_2']);

    metroGraph['line1_3']['line3_4'] += Math.floor(4 * stationLoad['line1_3']);

    metroGraph['line2_2']['line0_6'] += Math.floor(4 * stationLoad['line2_2']);
    metroGraph['line2_3']['line1_2'] += Math.floor(4 * stationLoad['line2_3']);

    metroGraph['line3_3']['line0_7'] += Math.floor(4 * stationLoad['line3_3']);

    metroGraph['line3_4']['line1_3'] += Math.floor(4 * stationLoad['line3_4']);

    metroGraph['line3_5']['line1_2'] += Math.floor(4 * stationLoad['line3_5']);
    metroGraph['line3_5']['line2_3'] += Math.floor(4 * stationLoad['line3_5']);
}

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
    document.getElementById(_id).innerHTML = Math.floor(load * 100) + "%";

    _id = 'loadindicator__circle_t' + transfersAmount;
    _id1 = 'loadindicator__lightning_t' + transfersAmount;
    _id2 = 'additional_time_t' + transfersAmount;
    if (load < .40) {
        document.getElementById(_id).style.fill = '#64AF63';
        document.getElementById(_id1).style.fill = '#FFFFFF';
        document.getElementById(_id2).style.color = '#64AF63';
    }
    else if (load < .70) {
        document.getElementById(_id).style.fill = '#B99F5E';
        document.getElementById(_id1).style.fill = '#FFFFFF';
        document.getElementById(_id2).style.color = '#B99F5E';
    }
    else {
        document.getElementById(_id).style.fill = '#C74444';
        document.getElementById(_id1).style.fill = '#FFFFFF';
        document.getElementById(_id2).style.color = '#C74444';
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

            transferTime = metroGraph[route[i - 1]][route[i]];
            load = stationLoad[route[i - 1]];
            additionalTime = Math.floor(4 * load);
            totalTime += transferTime;

            addTransferRouteStep(route[i - 1], route[i], transferTime, additionalTime, load);
            if (stationCount == 0) {
                stationCount += 1;
            }
            continue;
        }

        trainTime += metroGraph[route[i - 1]][route[i]];

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
    document.getElementById('transfer_step3').classList.add('_hidden');
    document.getElementById('transfer_step4').classList.add('_hidden');
    document.getElementById('train_step1').classList.add('_hidden');
    document.getElementById('train_step2').classList.add('_hidden');
    document.getElementById('train_step3').classList.add('_hidden');
    document.getElementById('train_step4').classList.add('_hidden');
    document.getElementById('train_step5').classList.add('_hidden');
    document.getElementById('route-info').classList.add('_hidden');
    document.getElementById('sl__icon_from_1').classList = '';
    document.getElementById('sl__icon_from_2').classList = '';
    document.getElementById('sl__icon_from_3').classList = '';
    document.getElementById('sl__icon_from_4').classList = '';
    document.getElementById('sl__icon_from_5').classList = '';
    document.getElementById('sl__icon_to_1').classList = '';
    document.getElementById('sl__icon_to_2').classList = '';
    document.getElementById('sl__icon_to_3').classList = '';
    document.getElementById('sl__icon_to_4').classList = '';
    document.getElementById('sl__icon_to_5').classList = '';
    document.getElementById('sl__icon_from_t1').classList = '';
    document.getElementById('sl__icon_from_t2').classList = '';
    document.getElementById('sl__icon_from_t3').classList = '';
    document.getElementById('sl__icon_from_t4').classList = '';
    document.getElementById('sl__icon_to_t1').classList = '';
    document.getElementById('sl__icon_to_t2').classList = '';
    document.getElementById('sl__icon_to_t3').classList = ''
    document.getElementById('sl__icon_to_t4').classList = ''
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

function findNearestVertex(distances, visited) {
    let minDistance = Infinity;
    let nearestVertex = null;
  
    Object.keys(distances).forEach(vertex => {
      if (!visited[vertex] && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        nearestVertex = vertex;
      }
    });
  
    return nearestVertex;
}

function findPath(graph, startVertex) {
    let visited = {};
    let distances = {};
    let previous = {};

    let vertices = Object.keys(graph);

    vertices.forEach(vertex => {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    });

    distances[startVertex] = 0;
    function handleVertex(vertex) {
        let activeVertexDistance = distances[vertex]; 
        let neighbours = graph[activeVertex];

        Object.keys(neighbours).forEach(neighbourVertex => {
            let currentNeighbourDistance = distances[neighbourVertex];
            let newNeighbourDistance = activeVertexDistance + neighbours[neighbourVertex];

            if (newNeighbourDistance < currentNeighbourDistance) {
                distances[neighbourVertex] = newNeighbourDistance;
                previous[neighbourVertex] = vertex;
            }
        });

        visited[vertex] = 1;
    }

    let activeVertex = findNearestVertex(distances, visited);

    while(activeVertex) {
        handleVertex(activeVertex);
        activeVertex = findNearestVertex(distances, visited);
    }

    return {distances, previous};
}

function traceRoute(route) {
    currentStation = toSelected;
    let finalRoute = []
    finalRoute.push(toSelected)
    while (currentStation != fromSelected) {
        currentStation = route['previous'][currentStation];
        finalRoute.push(currentStation);
    }
    finalRoute.reverse()
    return finalRoute;
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
        document.getElementById(id).classList.add('_bold');
    }
    else if ((toSelected == null) && (id != fromSelected)) {
        toSelected = id;
        _classname = '_' + id.slice(0, 5);
        document.getElementById('to_remove').classList.add(_classname);
        document.getElementById("to_remove").value = stationNames[id];
        document.getElementById(id).classList.add('_bold');
    }
    else {
        if ((id != toSelected) && (id != fromSelected)) {
            document.getElementById(toSelected).classList.remove('_bold');
            toSelected = id;
            _classname = '_' + id.slice(0, 5);
            document.getElementById('to_remove').classList.remove('_line0');
            document.getElementById('to_remove').classList.remove('_line1');
            document.getElementById('to_remove').classList.remove('_line2');
            document.getElementById('to_remove').classList.remove('_line3');
            document.getElementById('to_remove').classList.add(_classname);
            document.getElementById("to_remove").value = stationNames[id];
            document.getElementById(id).classList.add('_bold')
            clearRouteDetails();
            removeFade();
        }
    }
    if ((fromSelected != null) && (toSelected != null)) {
        route = findPath(metroGraph, fromSelected);
        route = traceRoute(route);
        highlightRoute(route);
        showRouteDetails(route);
    }
}

function removeHandler(id) {
    inputField = document.getElementById(id);
    inputField.classList.remove('_line0');
    inputField.classList.remove('_line1');
    inputField.classList.remove('_line2');
    inputField.classList.remove('_line3');
    if (id == 'from_remove') {
        document.getElementById(fromSelected).classList.remove('_bold');
        inputField.value = 'Откуда';
        fromSelected = null;
    }
    else {
        document.getElementById(toSelected).classList.remove('_bold');
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
        fromRemove.classList.remove('_line3');
        toRemove.classList.remove('_line0');
        toRemove.classList.remove('_line1');
        toRemove.classList.remove('_line2');
        toRemove.classList.remove('_line3');

        _classname = '_' + fromSelected.slice(0, 5);
        fromRemove.classList.add(_classname);
        fromRemove.value = stationNames[fromSelected];

        _classname = '_' + toSelected.slice(0, 5);
        toRemove.classList.add(_classname);
        toRemove.value = stationNames[toSelected];

        removeFade();
        clearRouteDetails();

        route = findPath(metroGraph, fromSelected);
        route = traceRoute(route);
        highlightRoute(route);
        showRouteDetails(route);
    }
}