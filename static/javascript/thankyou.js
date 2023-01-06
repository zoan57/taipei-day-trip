function getCheckInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const order_number = urlParams.get('number');
    console.log(order_number);
    async function fetchOrder() {
        const fetchOrderInfo = await fetch("/api/order/" + order_number, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        });
        if (fetchOrderInfo.data != null) {
            const orderCheckName = document.getElementById("orderCheckName");
            const orderCheckPhone = document.getElementById("orderCheckPhone");
            const orderCheckEmail = document.getElementById("orderCheckEmail");
            const orderCheckDate = document.getElementById("orderCheckDate");
            const orderCheckTime = document.getElementById("orderCheckTime");
            const orderCheckImg = document.getElementById("orderCheckImg");
            const orderCheckAttrName = document.getElementById("orderCheckAttrName");
            const orderCheckNumber = document.getElementById("orderCheckNumber");
            orderCheckNumber.textContent = "訂單編號" + fetchOrderInfo.data.number;
            orderCheckName.textContent = fetchOrderInfo.data.contact.name;
            orderCheckPhone.textContent = fetchOrderInfo.data.contact.phone;
            orderCheckEmail.textContent = fetchOrderInfo.data.contact.email;
            console.log(fetchOrderInfo.data.trip.date);
            orderCheckDate.textContent = fetchOrderInfo.data.trip.date;
            orderCheckTime.textContent = fetchOrderInfo.data.trip.time;
            orderCheckAttrName.textContent = fetchOrderInfo.data.trip.attraction.name;
            orderCheckImg.src = fetchOrderInfo.data.trip.attraction.image;
        }
    };
    fetchOrder()
}