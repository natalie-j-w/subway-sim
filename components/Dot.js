export class Dot {
    constructor(x, y, id, name) {
        this.x = x;
        this.y = y;
        this.id = id || null;
        this.name = name || '';
        this.connections = [];

        this.element = this.createDOMElement();
        this.element.dotInstance = this;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y  = y;
        const size = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dot-size')
        );

        this.element.style.left = `${x - size / 2}px`;
        this.element.style.top  = `${y - size / 2}px`;
    }

    createDOMElement() {
        const new_dot = document.createElement('div');
        new_dot.className = 'stationDot';

        const size = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dot-size')
        );

        new_dot.style.position = 'absolute';
        new_dot.style.left = `${this.x - size / 2}px`;
        new_dot.style.top  = `${this.y - size / 2}px`;

        return new_dot;
    }
}