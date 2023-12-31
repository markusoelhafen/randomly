function getQuery(parameterName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName)?.split('-');
}

function updateSearchQuery() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    namesArr.length ? urlParams.set('names', namesArr.join('-')) : urlParams.delete('names');
    rolesArr.length ? urlParams.set('roles', rolesArr.join('-')) : urlParams.delete('roles');
    window.history.replaceState(null, null, "?" + urlParams.toString());
}

function getTargetArray(role) {
    switch(role) {
        case 'names':
            return namesArr;
        case 'roles':
            return rolesArr;
        default:
            return undefined;
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
                li.innerHTML = '<p>' + item + '</p>';
                li.innerHTML += '<svg class="list-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>'
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

function copyUrl() {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl);

    const success = document.getElementById('copy-success');
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 1700);
}

function showSettings() {
    const viewport = document.getElementById("viewport")
    viewport.style.height = 'auto';

    const hint = document.getElementById('hint');
    hint.style.display = 'block';

    const settings = document.getElementById('settings');
    const settingsIndicator = settings.getElementsByTagName('h2');
    settingsIndicator[0].style.display = 'none';
}

/////// INITIALIZE ///////

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { 
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : "light");
})

let namesArr = getQuery('names') || [];
let availableNamesArr = getQuery('names') || [];
let rolesArr = getQuery('roles') || [];

if (namesArr.length) {
    renderListItems();
    displayResults();
} else {
    console.log('No data to load...')
    showSettings()
}
