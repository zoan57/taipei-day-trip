// HEADER
class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!--HEADER-->
        <header class="header">
            <nav class="header-txt">
                <a href="/">
                    <h2>台北一日遊</h2>
                </a>
            <nav>
                <a href="#" id="bookingBar"><span>預定行程</span></a>
                <a href="#" id="loginBar"><span>登入/註冊</span></a>
                <span id="logOut">登出系統</span>
            </nav>
        </header>
        <div id="login">
            <div id="loginCard" class="loginFrame">
                <form class="userInfo">
                    <h3>登入會員帳號</h3>
                    <span id="btnTurnOff"></span>
                    <input type="email" name="loginEmail" placeholder="輸入電子信箱" class="userInfoCheck" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="請輸入有效的信箱">
                    <input type="password" name="loginPwd" autocomplete="off" placeholder="輸入密碼" class="userInfoCheck" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="密碼必須包含至少一個數字(0-9) 、一個大寫英文字母(A-Z)、一個小寫英文字母(a-z)，長度應至少8碼以上。">
                    <button type="submit" id="loginBtn">登入帳戶</button>
                    <span id="loginWarning"></span>
                    <span>還沒有帳戶？<span id="to_register">點此註冊</span></span>
                </form>
            </div>
        </div>
        <div id="register">
            <div id="registerCard" class="registerFrame">
                <form class="userInfo">
                    <h3>註冊會員帳號</h3>
                    <span id="btnTurnOff"></span>
                    <input type="text" name="name" placeholder="輸入姓名" maxlength="20" class="userInfoCheck" required>
                    <input type="email" name="registerEmail" placeholder="輸入電子信箱" class="userInfoCheck" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="請輸入有效的信箱">
                    <input type="password" name="registerPwd" autocomplete="off" placeholder="輸入密碼" class="userInfoCheck" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="密碼須包含大小寫英文字母，並需超過8個字元">
                    <button type="submit" id="registerBtn">註冊新帳戶</button>
                    <span id="registerWarning"></span>
                    <span>已經有帳戶了？<span id="to_login">點此登入</span></span>
                </form>
            </div>
        </div>`
    }
}

customElements.define('my-header', Header);
// LOGIN & REGISTER Click Setting
const loginBar = document.getElementById("loginBar");
const login = document.getElementById("login");
const loginCard = document.getElementById("loginCard");
const register = document.getElementById("register");
const registerCard = document.getElementById("registerCard");
const to_register = document.getElementById("to_register");
const to_login = document.getElementById("to_login");
const btnTurnOff = document.getElementById("btnTurnOff");
loginBar.addEventListener("click", () => {
    login.style.display = "block";
})
to_register.addEventListener("click", () => {
    login.style.display = "none";
    register.style.display = "block";
})
to_login.addEventListener("click", () => {
    register.style.display = "none";
    login.style.display = "block";
})
login.addEventListener("click", (event) => {
    if (!loginCard.contains(event.target)) {
        login.style.display = "none";
    }
})
register.addEventListener("click", (event) => {
    if (!registerCard.contains(event.target)) {
        register.style.display = "none";
    }
})
btnTurnOff.addEventListener("click", (event) => {
    register.style.display = "none";
    login.style.display = "none";
})



// FOOTER
class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!--FOOTER-->
        <footer>
            <span>COPYRIGHT © 台北一日遊</span>
        </footer>`
    }
}
customElements.define('my-footer', Footer);