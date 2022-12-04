const urlAPIattractions = '/api/attractions?page=';
const urlAPIcategories = '/api/categories';
const searchInput = document.getElementById('indexSearchBar');
const contentDiv = document.getElementById('searchCategoryKeyword');

let currPage = 0;
let nextPage = 1;

/* CONTENT
    A. Build Search categories content, Fetch data to search bar 
    B. Build Index cards, Set 'Load More' function
    C. 
 */

/*  
    Build Search categories content, Fetch data to search bar 
*/

//Show, Hide, Insert Category
document.addEventListener("click", function(event) {
    if (searchInput.contains(event.target)) {
        contentDiv.classList.toggle('isClose');
    } else {
        contentDiv.classList.add('isClose');

    }
});
contentDiv.addEventListener('mouseover', () => {
        let searchCat = document.getElementById('searchCategory').querySelectorAll('span');
        let searchDiv = document.querySelectorAll('.category');
        for (let i = 0; i < searchCat.length; i++) {
            searchDiv[i].addEventListener('click', () => {
                let searchInput = document.getElementById('indexSearchBar');
                searchInput.value = searchCat[i].textContent;
            })
        }
    })
    // Fetch Categories API, and Insert categories
function getCategories() {
    fetch(urlAPIcategories).then(function(response) {
        return response.json();
    }).then(function(data) {
        let output = data['data'];
        for (i = 0; i < output.length; i++) {
            catName = output[i];

            let searchCat = document.getElementById('searchCategory');

            function addCat() {
                let divCat = document.createElement('div');
                divCat.classList.add('category');
                divCat.href = '';
                let catTxt = document.createElement('span');
                catTxt.textContent = catName;
                divCat.appendChild(catTxt);
                searchCat.appendChild(divCat);
            };
            addCat();
        }
    })
}


/*  
    Build Index cards
*/
//Fetch and load 1st Index Cards
function getData() {
    fetch(urlAPIattractions + currPage + "&keyword=" + searchInput.value).then(function(response) {
        return response.json();
    }).then(function(data) {
        let output = data['data'];
        console.log(output);
        for (i = 0; i < output.length; i++) {
            spot = output[i]["name"];
            category = output[i]["category"];
            image = output[i]["images"][0];
            mrt = output[i]["mrt"];
            let displayBox = document.getElementById('index-display-box');

            function add() {
                // Set everything about cards here:
                // Add Card Top
                let cardLink = document.createElement('a');
                cardLink.classList.add('cardLink');
                cardLink.href = '#';
                let card = document.createElement('div');
                card.classList.add('card');
                let cardImg = document.createElement('img');
                cardImg.src = image;
                let spotName = document.createElement('span');
                spotName.classList.add('attrName');
                spotName.textContent = spot;
                let cardTopTxtBar = document.createElement('div');
                cardTopTxtBar.classList.add('cardTopTxtBar');
                card.appendChild(cardImg);
                card.appendChild(spotName)
                card.appendChild(cardTopTxtBar);
                // Add Card Bottom
                let cardBottom = document.createElement('div');
                cardBottom.classList.add('cardBottom');
                let txtMrt = document.createElement('span');
                txtMrt.textContent = mrt;
                let txtCategory = document.createElement('span');
                txtCategory.textContent = category;
                cardBottom.appendChild(txtMrt);
                cardBottom.appendChild(txtCategory);
                // Append all card elements
                card.appendChild(cardBottom);
                cardLink.appendChild(card);
                displayBox.appendChild(cardLink);
            };
            add();
        }
    })
}

// Load More setting by IntersectionObserver
const footerObs = document.querySelector('.footer');
const loadMore = document.getElementById('loadMore');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) { return; }
        if (nextPage == null) {
            loadMore.remove();
            return;
        } else if (nextPage !== null) {
            fetch(urlAPIattractions + nextPage + "&keyword=" + searchInput.value).then(function(response) {
                return response.json();
            }).then(function(data) {
                let output = data['data'];
                console.log(output);
                for (i = 0; i < output.length; i++) {
                    spot = output[i]["name"];
                    category = output[i]["category"];
                    image = output[i]["images"][0];
                    mrt = output[i]["mrt"];
                    let displayBox = document.getElementById('index-display-box');

                    function add() {
                        // Set everything about cards here:
                        // Add Card Top
                        let cardLink = document.createElement('a');
                        cardLink.classList.add('cardLink');
                        cardLink.href = '#';
                        let card = document.createElement('div');
                        card.classList.add('card');
                        let cardImg = document.createElement('img');
                        cardImg.src = image;
                        let spotName = document.createElement('span');
                        spotName.classList.add('attrName');
                        spotName.textContent = spot;
                        let cardTopTxtBar = document.createElement('div');
                        cardTopTxtBar.classList.add('cardTopTxtBar');
                        card.appendChild(cardImg);
                        card.appendChild(spotName)
                        card.appendChild(cardTopTxtBar);
                        // Add Card Bottom
                        let cardBottom = document.createElement('div');
                        cardBottom.classList.add('cardBottom');
                        let txtMrt = document.createElement('span');
                        txtMrt.textContent = mrt;
                        let txtCategory = document.createElement('span');
                        txtCategory.textContent = category;
                        cardBottom.appendChild(txtMrt);
                        cardBottom.appendChild(txtCategory);
                        // Append all card elements
                        card.appendChild(cardBottom);
                        cardLink.appendChild(card);
                        displayBox.appendChild(cardLink);
                    };
                    add();
                }
                nextPage = data['nextPage'];
            })
        }
    });
});
// if viewers want to see more cards, load more by clicking
loadMore.addEventListener('click', () => {
    observer.observe(footerObs);
})

/*  
    Search setting
*/
const searchBtn = document.querySelector('.indexSearchButton');
const displayBox = document.getElementById('index-display-box');

function removeSearch() {
    const cardResult = document.querySelectorAll(".cardLink");
    for (i = 0; i < cardResult.length; i++) {
        cardResult[i].remove();
    }
}

function search() {
    if (!searchInput.value) {
        removeSearch();
        document.getElementById('errDiv').style.display = 'block';
        loadMore.remove();
    } else {
        fetch(urlAPIattractions + currPage + "&keyword=" + searchInput.value).then(function(response) {
            return response.json();
        }).then(function(data) {
            let output = data['data'];
            console.log(output);
            if (output[0] == null) {
                removeSearch();
                document.getElementById('errDiv').style.display = 'block';
            } else {
                removeSearch();
                document.getElementById('errDiv').style.display = 'none';
                for (i = 0; i < output.length; i++) {
                    spot = output[i]["name"];
                    category = output[i]["category"];
                    image = output[i]["images"][0];
                    mrt = output[i]["mrt"];
                    let displayBox = document.getElementById('index-display-box');

                    function add() {
                        // Set everything about cards here:
                        // Add Card Top
                        let cardLink = document.createElement('a');
                        cardLink.classList.add('cardLink');
                        cardLink.href = '#';
                        let card = document.createElement('div');
                        card.classList.add('card');
                        let cardImg = document.createElement('img');
                        cardImg.src = image;
                        let spotName = document.createElement('span');
                        spotName.classList.add('attrName');
                        spotName.textContent = spot;
                        let cardTopTxtBar = document.createElement('div');
                        cardTopTxtBar.classList.add('cardTopTxtBar');
                        card.appendChild(cardImg);
                        card.appendChild(spotName)
                        card.appendChild(cardTopTxtBar);
                        // Add Card Bottom
                        let cardBottom = document.createElement('div');
                        cardBottom.classList.add('cardBottom');
                        let txtMrt = document.createElement('span');
                        txtMrt.textContent = mrt;
                        let txtCategory = document.createElement('span');
                        txtCategory.textContent = category;
                        cardBottom.appendChild(txtMrt);
                        cardBottom.appendChild(txtCategory);
                        // Append all card elements
                        card.appendChild(cardBottom);
                        cardLink.appendChild(card);
                        displayBox.appendChild(cardLink);
                    };
                    add();
                }
                nextPage = data['nextPage'];
                if (nextPage == null) { loadMore.remove(); }
            }
        })
    }
}