const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

document.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginEmail = document.getElementsByName("loginEmail");
    const loginPwd = document.getElementsByName("loginPwd");
    const loginWarning = document.getElementById("loginWarning");
    const loginInfo = {
        "email": loginEmail[0].value,
        "password": loginPwd[0].value
    };
    async function login() {
        const fetchLogin = await fetch("/api/user/auth", {
            method: "PUT",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        });
        if (fetchLogin.ok) {
            location.reload()
        } else {
            loginWarning.textContent = "帳號或密碼錯誤";
            loginWarning.style.display = "block";
            setTimeout(() => { loginWarning.style.display = "none" }, 1000)
        }

    }
    login();
});
document.addEventListener("submit", (e) => {
    e.preventDefault();
    const registerEmail = document.getElementsByName("registerEmail");
    const registerPwd = document.getElementsByName("registerPwd");
    const name = document.getElementsByName("name");
    const registerWarning = document.getElementById("registerWarning");
    const registerInfo = {
        "name": name[0].value,
        "email": registerEmail[0].value,
        "password": registerPwd[0].value
    };
    async function register() {
        const fetchRegister = await fetch("/api/user", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(registerInfo)
        });
        if (fetchRegister.ok) {
            registerWarning.textContent = "註冊成功";
            registerWarning.style.display = "block";
        } else {
            registerWarning.textContent = "註冊失敗，重複的 Email 或其他原因";
            registerWarning.style.display = "block";
            setTimeout(() => { registerWarning.style.display = "none" }, 5000)
        }

    }
    register();
});
// Check Login & Log Out Status
const loginBar = document.getElementById("loginBar");
const logOut = document.getElementById("logOut");
window.addEventListener("load", () => {
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
        if (fetchCheck.data != null) {
            loginBar.style.display = "none";
            logOut.style.display = "inline-block";
            console.log("User logs in now!")
        };

    }
    statusCheck();
});
logOut.addEventListener("click", () => {
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
        if (fetchCheck.data != null) {
            const deletJWT = await fetch("/api/user/auth", {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(function(response) {
                return response.json()
            });
            loginBar.style.display = "inline-block";
            logOut.style.display = "none";
            console.log("User logs out now!")
        };

    }
    statusCheck();
})