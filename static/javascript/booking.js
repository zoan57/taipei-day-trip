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
};
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
});

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
            const bookingAttrId = document.getElementById("bookingAttrId");
            const bookingAttrName = document.getElementById("bookingAttrName");
            const attrImg = document.getElementById("attrImg");
            const bookingDate = document.getElementById("bookingDate");
            const bookingTime = document.getElementById("bookingTime");
            const bookingPrice = document.getElementById("bookingPrice");
            const bookingAddress = document.getElementById("bookingAddress");


            bookingAttrId.textContent = fetchBookingInfo.data['attraction']["id"];
            bookingAttrName.textContent = fetchBookingInfo.data['attraction']['name'];

            const addAttrImg = document.createElement('img');
            addAttrImg.setAttribute('id', 'attrImgLink');
            addAttrImg.src = fetchBookingInfo.data['attraction']['image'];
            attrImg.appendChild(addAttrImg);

            bookingDate.textContent = fetchBookingInfo.data['date'];

            if (fetchBookingInfo.data['time'] == 'morning') { bookingTime.textContent = '上午 10 點 到 中午 12 點' } else {
                bookingTime.textContent = '下午 2點 到 4點'
            };
            if (fetchBookingInfo.data['price'] == 2000) { bookingPrice.textContent = ' 2000' } else {
                bookingPrice.textContent = '2500'
            };
            const bookingTotalPrice = document.getElementById("bookingTotalPrice");
            if (fetchBookingInfo.data['price'] == 2000) { bookingTotalPrice.textContent = '新台幣 2000 元' } else {
                bookingTotalPrice.textContent = '新台幣 2500 元'
            };

            bookingAddress.textContent = fetchBookingInfo.data['attraction']['address'];

        };
    }
    fetchGetBooking();
};

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
});

// Tap Pay Setting

window.addEventListener("submit", (e) => {
    e.preventDefault();
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('輸入的信用卡有誤或有其他問題')
        return
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('輸入的資料無法正確獲取：' + result.msg)
            return
        }
        const bookingLoading = document.getElementById("bookingLoading");
        bookingLoading.style.display = "block";
        const bookingAttrId = document.getElementById("bookingAttrId").innerHTML;
        const bookingAttrName = document.getElementById("bookingAttrName").innerHTML;
        const attrImg = document.getElementById("attrImgLink").src;
        const bookingDate = document.getElementById("bookingDate").innerHTML;
        const bookingTime = document.getElementById("bookingTime").innerHTML;
        const bookingPrice = document.getElementById("bookingPrice").innerHTML;
        const bookingAddress = document.getElementById("bookingAddress").innerHTML;
        const orderName = document.getElementById('orderName').value;
        const orderEmail = document.getElementById('orderEmail').value;
        const orderPhone = document.getElementById('orderPhone').value;
        data = {
            "prime": result.card.prime,
            "order": {
                "price": bookingPrice,
                "trip": {
                    "attraction": {
                        "id": bookingAttrId,
                        "name": bookingAttrName,
                        "address": bookingAddress,
                        "image": attrImg
                    },
                    "date": bookingDate,
                    "time": bookingTime
                },
                "contact": {
                    "name": orderName,
                    "email": orderEmail,
                    "phone": orderPhone
                }
            }
        };
        async function sendPrime() {
            const fetchOrder = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const fetchRes = await fetchOrder.json();

            window.location.href = '/thankyou?number=' + fetchRes.data.number;


        }
        sendPrime();
    })

});
// Display Credit Card field
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
});