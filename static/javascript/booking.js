// Check the loading status of the booking page
function checkLoginStatus() {
    async function statusCheck() {
        const fetchCheck = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        });
        if (fetchCheck.data == null) {
            window.location.href = "/";
        };

    }
    statusCheck();
}
//Process a booking
const startBooking = document.getElementById("startBooking");
window.addEventListener("submit", (e) => {
    e.preventDefault();
    // Check Login Status, if not, ask for login first.
    async function check_and_book() {
        const fetchCheck = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        });
        if (fetchCheck.data == null) {
            login.style.display = "block";
        } else if (fetchCheck.data['email'] != null) {
            const attrIdPath = window.location.pathname.split('/');
            const attrId = attrIdPath[attrIdPath.length - 1];
            const attrDate = document.getElementById('attrDate').value;
            const attrTimeCheck = document.getElementById('radioDay').checked;
            let attrTime = 'unkown';
            let attrPrice = 0
            if (attrTimeCheck == true) {
                attrTime = 'morning';
                attrPrice = 2000
            } else {
                attrTime = 'afternoon';
                attrPrice = 2500
            };
            const addBooking = {
                "attractionId": attrId,
                "date": attrDate,
                "time": attrTime,
                "price": attrPrice
            };
            fetch("/api/booking", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(addBooking)
            });
            window.location.href = "/booking";
        }
    }
    check_and_book();
})

//In booking page,show the current booking infomation
function getBookingInfo() {
    async function fetchGetBooking() {
        const fetchBookingInfo = await fetch("/api/booking", {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        });
        async function addUserName() {
            const userCheck = await fetch("/api/user/auth", {
                method: "GET",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                return response.json()
            });
            const bookingWelcomeName = document.getElementById("bookingWelcomeName");
            bookingWelcomeName.textContent = userCheck.data['name'];
        }
        if (fetchBookingInfo.data == null) {
            addUserName();
            const addOrder = document.getElementById("addOrder");
            const bookingGReeting = document.getElementById("bookingGreeting");
            const footer = document.getElementById("footer");
            const noneBookingWarning = document.createElement('span');
            noneBookingWarning.textContent = "目前沒有任何待預訂的行程";
            bookingGReeting.appendChild(noneBookingWarning);
            addOrder.remove();
            footer.classList.add("noneBookingFooter");
        } else {
            // Get User name
            addUserName();
            const bookingAttrName = document.getElementById("bookingAttrName");
            bookingAttrName.textContent = fetchBookingInfo.data['attraction']['name'];

            const attrImg = document.getElementById("attrImg");
            const addAttrImg = document.createElement('img');
            addAttrImg.src = fetchBookingInfo.data['attraction']['image'];
            attrImg.appendChild(addAttrImg);

            const bookingDate = document.getElementById("bookingDate");
            bookingDate.textContent = fetchBookingInfo.data['date'];

            const bookingTime = document.getElementById("bookingTime");
            if (fetchBookingInfo.data['time'] == 'morning') { bookingTime.textContent = '上午 10 點 到 中午 12 點' } else {
                bookingTime.textContent = '下午 2點 到 4點'
            };

            const bookingPrice = document.getElementById("bookingPrice");
            if (fetchBookingInfo.data['price'] == 2000) { bookingPrice.textContent = '新台幣 2000 元' } else {
                bookingPrice.textContent = '新台幣 2500 元'
            };
            const bookingTotalPrice = document.getElementById("bookingTotalPrice");
            if (fetchBookingInfo.data['price'] == 2000) { bookingTotalPrice.textContent = '新台幣 2000 元' } else {
                bookingTotalPrice.textContent = '新台幣 2500 元'
            };

            const bookingAddress = document.getElementById("bookingAddress");
            bookingAddress.textContent = fetchBookingInfo.data['attraction']['address'];


        };
    }
    fetchGetBooking();
}

// Delete the Current booking
const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
    async function deleteBooking() {
        const fetchDelteBookingAPI = await fetch("/api/booking", {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        });
        window.location.reload();
    };
    deleteBooking();
})