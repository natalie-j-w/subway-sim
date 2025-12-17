class Dot extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.innerHTML = `
        <link rel="stylesheet" href="/components/Dot.css" />

        <div id="circle">
        </div>
        `;
    }

    setPosition(x, y) {
        const size = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dot-size')
        );
        

        this.style.position = 'absolute';
        this.style.left = `${x - size / 2}px`;
        this.style.top  = `${y - size / 2}px`;
    }

}

customElements.define('station-dot', Dot);