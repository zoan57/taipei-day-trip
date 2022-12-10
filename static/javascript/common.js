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
                <a href="#"><span>預定行程</span></a>
                <a href="#"><span>登入/註冊</span></a>
            </nav>
        </header>`
    }
}
customElements.define('my-header', Header);

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