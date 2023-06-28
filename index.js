const getQuery = (query) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(query)?.split('-');
}

const loadListItems = () => {
    const forms = document.getElementsByTagName("form")

    for (const node of forms) {
        const parentNode = node.parentElement
        var items = [];

        switch (node.getAttribute('id')) {
            case 'nameForm':
                items = namesArr;
                break;
            case 'roleForm':
                items = rolesArr;
                break;
            default:
                items = null;
        }

        items != null &&
            items.map(item => {
                var li = document.createElement('li');
                li.textContent = item;
                parentNode.insertBefore(li, node);
            })
    }
}

let namesArr, availableNamesArr, rolesArr = [];

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

    if (rolesArr) {
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
        var result = 'Today, ' + pickNames(availableNamesArr) + ' is the chosen one!'

    }

    const res = document.getElementById('res');
    res.innerHTML = result;
    // resultDiv.appendChild(content);
}

/////// ADD NEW ITEM TO LIST ///////

const addItem = (element) => {
    console.log(element);
    const input = element.children[0]
    console.log(input.value)
    var items = [];
    var params = "";

    switch (input.getAttribute('id')) {
        case 'nameInput':
            items = namesArr;
            params = 'names';
            break;
        case 'roleInput':
            items = rolesArr;
            params = 'roles';
            break;
        default:
            items = null;
    }

    items.push(input.value)

    // Append item to list
    const parentNode = element.parentNode
    const li = document.createElement('li');
    li.textContent = input.value;
    parentNode.insertBefore(li, element)

    // Update Query
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.set(params, items.join('-'));
    window.history.replaceState(null, null, "?" + urlParams.toString());

    input.value = "";
}


/////// INITIALIZE ///////

const init = () => {
    namesArr = getQuery('names');
    availableNamesArr = getQuery('names');
    rolesArr = getQuery('roles');
    // showNames();
    // showRoles();
    loadListItems();
    displayResults();
}

init();
