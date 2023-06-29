const letters = "ndom"
const array = letters.split('')

const letterStyles = [
    "italic",
    "mono",
    "mono-italic",
    "bold",
    "bold-italic",
    "thin",
    "thin-italic",
    "serif",
    "serif-italic"
]

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array
}

function randomClass(styles) {
    let index = Math.floor(Math.random() * styles.length);

    return styles[index]
}

function createLogo() {
    const logo = document.getElementById("logo");

    const shuffled = shuffle(array);
    let allLetters = ["r", "a"].concat(shuffled, ["l", "y"]);

    logo.innerHTML = '';

    allLetters.forEach((letter, i) => {
        var span = document.createElement('span');
        span.className = (i != 0 ? randomClass(letterStyles) : "default");
        span.textContent = letter;

        logo.appendChild(span);
    })
    


}

createLogo()