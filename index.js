function getQuery(parameterName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName)?.split('-');
}

function updateSearchQuery() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.set('names', namesArr.join('-'));
    urlParams.set('roles', rolesArr.join('-'));
    window.history.replaceState(null, null, "?" + urlParams.toString());
}

function getTargetArray(role) {
    switch(role) {
        case 'names':
            return namesArr;
        case 'roles':
            return rolesArr;
        default:
            return [];
    }
}

function resetListItems() {
    const li = document.querySelectorAll(".iaNode");

    li.forEach(el => {
        try {
            el.remove()
        } catch (error) {
            console.error(error)
        }
    });
}

const renderListItems = () => {
    resetListItems();

    const forms = document.getElementsByTagName("form");

    for (const node of forms) {
        const parentNode = node.parentElement
        var items = getTargetArray(node.getAttribute('role'));

        items != null &&
            items.map(item => {
                var li = document.createElement('li');
                li.className = 'iaNode';
                li.onclick = deleteItem;
                li.textContent = item;
                parentNode.insertBefore(li, node);
            })
    }
}

/////// SHOW RESULTS ///////

const pickRandom = (max) => Math.floor(Math.random() * max)

const pickNames = () => {
    const index = pickRandom(availableNamesArr.length)
    const selected = availableNamesArr[index]
    availableNamesArr.splice(index, 1)

    return selected
}

const displayResults = () => {
    var result;

    var iteration = getQuery('iteration')
    iteration === undefined ? iteration = 'Today' : iteration = iteration[0]

    if (rolesArr.length) {
        if (rolesArr.length > 0) {
            result = iteration + ', <br />'
            rolesArr.map((role, i) => {
                result += '<span class=\'name\'>' + pickNames() + '</span> is our ' + role
                if (i < rolesArr.length - 2) { result += ', ' }
                else if (i < rolesArr.length - 1) { result += ' & ' }
                else { result += '!' }
            })
        }
    } else {
        result = 'Today, ' + pickNames(availableNamesArr) + ' is the chosen one!'
    }

    const res = document.getElementById('res');
    res.innerHTML = result;
}

/////// MANIPULATE ITEMS ///////

function addItem(element) {
    const input = element.children[0]
    const targetArr = getTargetArray(element.getAttribute('role'));

    targetArr.push(input.value);

    renderListItems();
    updateSearchQuery();

    input.value = "";
}

function deleteItem(element) {
    const targetArr = getTargetArray(element.target.parentNode.getAttribute('role'));
    const textContext = element.target.textContent;
    const index = targetArr.indexOf(textContext);
    index > -1 && targetArr.splice(index, 1);
    
    renderListItems();
    updateSearchQuery();
}


/////// INITIALIZE ///////

let namesArr = getQuery('names') || [];
let availableNamesArr = getQuery('names') || [];
let rolesArr = getQuery('roles') || [];

if (namesArr.length) {
    renderListItems();
    displayResults();
} else {
    console.log('No data to load...')
}
