
const paymentMethod = document.getElementsByClassName("payment_method_item");
const step1 = document.getElementById('step_1');
const step2 = document.getElementById('step_2');
const step3 = document.getElementById('step_3');
const step4 = document.getElementById('step_4');
const step5 = document.getElementById('step_5');
const step3CountTime = document.getElementById('count_time_text');
const step3Title = document.getElementById('step_3_title');
const loading = document.getElementById('loading');
const payDone = document.getElementById('pay_done');
const exit = document.getElementsByClassName("exit");
const urlScan = 'https://api.autoqr.vn';
var scanData = null;
var nameDevice = null;
var countTime = 30;
var yourChoose = null;
var session_id = null;
var destination_id = "";
//ckbfe487gojn9u40u5n0

[...exit].forEach(el => el.addEventListener('click', event => {
    window.location.href = 'https://autoqr.vn/';
}));


function callPayment(url, method) {
    if (yourChoose && session_id) {
        document.getElementById("payment_method_confirm").style.display = "block";

        fetch(urlScan + url, {
            method: "POST",
            body: JSON.stringify({
                "amount": yourChoose.price,
                "minute": yourChoose.time,
                "destination_id": destination_id,
            }),
            headers: {
                "x-session-id": session_id,
            },
        }).then((res) => res.json()).then((data) => {
            if (data.status === "success") {
                document.getElementById("iconPopup").src = `./${method}.png`;
                document.getElementById("chooseServiceMoneyPopup").innerHTML = yourChoose.price + " VND";
                document.getElementById("chooseServicePopup").innerHTML = Math.floor(yourChoose.time / 60) + "  phút sử dụng dịch vụ";
                document.getElementById("deedlink").href = data.data.deeplink;
                document.getElementById("payment_method_confirm_content").style.display = "block";

                // window.open(data.data.deeplink)
            }
        })
    }
}

[...paymentMethod].forEach(el => el.addEventListener('click', event => {
    const method = event.target.getAttribute("payment-partner");
    if (method) {
        let url = null;
        switch (method) {
            case "zalopay":
                url = "/api/v1/payment/zalopay"
                break;
            case "momo":
                url = "/api/v1/payment/momo"
                break;
            default:
                break;
        }
        if (url) {
            callPayment(url, method)
        }
    }

    if (yourChoose && session_id) {

    }
}))

document.getElementById('btn_pay').addEventListener('click', (el) => {
    if (yourChoose) {
        step1.style.display = "none";
        step2.style.display = "block";
    }
})


addEventListener("DOMContentLoaded", (event) => {
    const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const title = document.getElementById("title_name_device");
    switch (path) {
        case "zalopay":
            if (title) {
                title.innerHTML = "Cảm ơn quý khách";
            }
            paymentZaloPay(urlParams)
            break;
        case 'momo':
            if (title) {
                title.innerHTML = "Cảm ơn quý khách";
            }
            paymentMomo(urlParams)
            break;
        default:
            destination_id = path;
            scan();
            document.getElementById("closePopup").addEventListener("click", () => {
                document.getElementById("payment_method_confirm").style.display = "none";
                document.getElementById("payment_method_confirm_content").style.display = "none";

            })
            break;
    }
});


function scan() {
    fetch(urlScan + `/${destination_id}`, {
        method: "get",
    }).then(res => {
        res.json().then((data) => {
            if (data.status === "success") {
                nameDevice = data.data.device.name + " - " + data.data.device.add;
                const title = document.getElementById("title_name_device");
                if (title) {
                    title.innerHTML = nameDevice;
                }
                let dataRes = data.data.prices;
                let serverDiv = document.getElementById("service");
                session_id = data?.data?.session_id
                if (serverDiv && dataRes?.length && session_id) {
                    scanData = dataRes;
                    dataRes.forEach((item, index) => {
                        let divItem = document.createElement("div");
                        divItem.setAttribute("payment", index)
                        divItem.classList.add("content_pay_item");
                        let time = document.createElement("p");
                        time.innerHTML = Math.floor(item.time / 60) + " phút";
                        let price = document.createElement('p');
                        price.innerHTML = "VND " + item.price;
                        price.classList.add("content_pay_money");
                        divItem.append(time);
                        divItem.append(price);
                        serverDiv.append(divItem)
                    });
                    const choose = document.getElementsByClassName("content_pay_item");
                    [...choose].forEach(el => el.addEventListener('click', event => {
                        [...choose].forEach(ele => {
                            if (ele !== el) {
                                ele.classList.remove("active");
                            } else {
                                ele.classList.add("active");
                                console.log(scanData && +ele.getAttribute('payment'));
                                if (scanData && typeof +ele.getAttribute('payment') === "number") {
                                    yourChoose = scanData[+ele.getAttribute('payment')];
                                    console.log(yourChoose);
                                    document.getElementById("btn_pay").disabled = false;
                                }
                            }
                        })
                    }));
                    const controller = new AbortController()

                    const timeoutId = setTimeout(() => controller.abort(), 31000)

                    fetch(urlScan + `/api/v1/devices/${destination_id}/status`, {
                        method: "GET",
                        headers: {
                            "x-session-id": session_id,
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        signal: controller.signal
                    }).then((res) => res.json()).then((data) => {
                        if (data.status === "success") {
                            document.getElementById("loadingScan").style.display = 'none';
                            if (data.data.status === "free") {
                                document.getElementById('btn_pay').style.display = 'block';
                            } else {
                                const err = document.getElementById("error_scan");
                                if (data.data.status === "running") {
                                    err.style.display = "block";
                                    err.innerHTML = " Máy hiện tại đang hoạt động ! vui lòng thử lại sau";
                                }
                                if (data.data.status === "disconnect") {
                                    err.style.display = "block";
                                    err.innerHTML = " Máy hiện tại đang mất kết nối ! vui lòng thử lại sau";
                                }
                            }
                        }
                    })

                }
            }
        })
    })
}

function paymentMomo(param) {
    if (param.get("resultCode") !== null && param.get("resultCode") !== undefined && param.get("orderId")) {
        paymentDone(param.get("orderId"));
    }
}
function paymentZaloPay(param) {
    if (param.get("status") == 1 && param.get("apptransid")) {
        const transId = param.get("apptransid").split("_");
        paymentDone(transId[transId.length - 1]);
    }
}

function paymentDone(transId) {
    step1.style.display = "none";
    step2.style.display = "none";
    step4.style.display = "none";
    step5.style.display = "none";
    step3CountTime.innerHTML = countTime;
    step3.style.display = "block";
    fetch(urlScan + `/api/v1/payment/tran/` + transId, {
        method: "GET",
    }).then((res) => res.json()).then((data) => {
        if (data.status === "success") {
            const money = document.getElementById("chooseServiceMoney");
            const time = document.getElementById("chooseService");

            money.innerHTML = data.data.amount + " VND";
            time.innerHTML = Math.floor(data.data.second / 60) + "  phút sử dụng dịch vụ";

            session_id = data.data.session_id;
            var waitCountTime = 0;
            const interval = setInterval(() => {
                countTime -= 1;
                waitCountTime += 1;
                step3CountTime.innerHTML = countTime;
                if (!countTime) {
                    clearInterval(interval);

                }
            }, 1000);
            checkDevice(transId).then((data) => {
                if (data.status === "success") {
                    if (data.data.status === "running") {
                        step3Title.innerHTML = 'Hoàn tất khởi động';
                        loading.style.display = "none";
                        payDone.style.display = "block";
                        const title = document.getElementById("info_payment_device");
                        if (title) {
                            title.innerHTML = nameDevice;
                        }
                        clearInterval(interval);
                    } else {
                        step3.style.display = "none";
                        step4.style.display = "block";
                        report();
                    }
                }
            }).catch(() => {
                step3.style.display = "none";
                step4.style.display = "block";
                report()
            })
        }
    })
}

function report() {
    document.getElementById("form_report").addEventListener("submit", (e) => {
        e.preventDefault();
        if (document.forms.length) {
            console.log(document.forms[0].elements['name'].value);
        }
        fetch(urlScan + '/api/v1/contacts', {
            method: "POST",
            headers: {
                "x-session-id": session_id,
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name: document.forms[0].elements['name'].value,
                phone: document.forms[0].elements['phone'].value,
                email: document.forms[0].elements['email'].value,
                note: document.forms[0].elements['note'].value
            })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.status === "success") {
                    step4.style.display = "none";
                    step5.style.display = "block";
                } else {
                    document.getElementById("report_err").style.display = "block";
                    document.getElementById("closePopupform").addEventListener("click", () => {
                        document.getElementById("report_err").style.display = "none";
                    })
                }
            });

    })
}

function checkDevice(transId) {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => controller.abort(), 31000)
    return fetch(urlScan + `/api/v1/devices/${destination_id}/status?payment_id=${transId}`, {
        method: "GET",
        headers: {
            "x-session-id": session_id,
        },
        signal: controller.signal
    }).then((res) => res.json());
}


// setInterval(() => {
//     var minimalUserResponseInMiliseconds = 100;
//     var before = new Date().getTime();
//     debugger;
//     var after = new Date().getTime();
//     if (after - before > minimalUserResponseInMiliseconds) {
//         document.body.innerHTML = '';
//     }
// }, 100);
