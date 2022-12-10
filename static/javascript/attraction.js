const apiPath = window.location.pathname.split('/');
const apiId = apiPath[apiPath.length - 1];

const attrName = document.getElementById('attr-name');
const attrCatNMrt = document.getElementById("attr-category-mrt");
const attrIntro = document.getElementById("attr-intro");
const attrAddr = document.getElementById("attr-addr");
const attrTrans = document.getElementById("attr-transport");
const attrImg = document.getElementById('attr-img');
const attractionAPIUrl = "/api/attraction/" + apiId;
const displayBox = document.getElementById('clickBox');



//Fetch Attraction data by ID
fetch(attractionAPIUrl).then((response) => {
    return response.json()
}).then((data) => {
    result = data.data;
    attrName.textContent = result["name"];
    attrCatNMrt.textContent = result["category"] + " at " + result["mrt"];
    attrIntro.textContent = result["description"];
    attrAddr.textContent = result["address"];
    attrTrans.textContent = "捷運站名：" + result["transport"];
    imgs = result["images"];
    for (i = 0; i < imgs.length; i++) {
        const img = document.createElement('img');
        img.src = imgs[i];
        img.classList.add('img-display');
        attrImg.appendChild(img);
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const dotList = document.getElementById('dot-list');
        dotList.appendChild(dot);
    }
    const displayImg = document.querySelectorAll('.img-display');
    const dots = document.querySelectorAll('.dot');
    displayImg[0].style.display = 'block';
    dots[0].style.backgroundColor = "black";
});

//Attraction Images Slideshow Setting
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dotList = document.getElementById('dot-list');
let imgCurrent = 0;
prev.addEventListener('click', () => {
    const displayImg = document.querySelectorAll('.img-display');
    const dots = document.querySelectorAll('.dot');
    if (imgCurrent <= 0) {
        imgCurrent = 0;
        displayImg[imgCurrent].style.display = 'none';
        dots[imgCurrent].style.backgroundColor = "white";
        imgCurrent = displayImg.length - 1;
        displayImg[imgCurrent].style.display = 'block';
        dots[imgCurrent].style.backgroundColor = "black";
    } else if (imgCurrent < (displayImg.length)) {
        displayImg[imgCurrent].style.display = 'none';
        dots[imgCurrent].style.backgroundColor = "white";
        imgCurrent -= 1;
        displayImg[imgCurrent].style.display = 'block';
        dots[imgCurrent].style.backgroundColor = "black";
    }
})
next.addEventListener('click', () => {
    const displayImg = document.querySelectorAll('.img-display');
    const dots = document.querySelectorAll('.dot');
    if (imgCurrent < (displayImg.length - 1)) {
        displayImg[imgCurrent].style.display = 'none';
        dots[imgCurrent].style.backgroundColor = "white";
        imgCurrent += 1;
        displayImg[imgCurrent].style.display = 'block';
        dots[imgCurrent].style.backgroundColor = "black";
    } else if (imgCurrent >= (displayImg.length - 1)) {
        displayImg[imgCurrent].style.display = 'none';
        dots[imgCurrent].style.backgroundColor = "white";
        imgCurrent = 0;
        displayImg[imgCurrent].style.display = 'block';
        dots[imgCurrent].style.backgroundColor = "black";
    }

})


//Switch Reservation Day/Afternoon
document.querySelector('.day').addEventListener("click", () => {
    document.getElementById('clickDay').style.display = 'inline-block';
    document.getElementById('clickAfternoon').style.display = 'none';
});
document.querySelector('.afternoon').addEventListener("click", () => {
    document.getElementById('clickDay').style.display = 'none';
    document.getElementById('clickAfternoon').style.display = 'inline-block';
});