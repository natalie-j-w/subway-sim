import {JS_VARS, CSS_VARS} from '../constants.js'

export class Dot {
    x;
    y;
    showNameLabel;
    id;
    #name;
    connections;

    constructor(x, y, id, name) {
        this.x = x;
        this.y = y;
        this.showNameLabel = true;
        this.id = id || null;
        this.#name = name || 'Unnamed';
        this.connections = [];

        this.element = this.createDOMElement();
        this.label;
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
        const dot = document.createElement('div');
        const label = document.createElement('div');
        dot.className = CSS_VARS.DOT_CLASSNAME;
        label.className = CSS_VARS.DOT_LABEL_CLASSNAME;

        this.label = label;
        label.textContent = this.#name;

        const size = parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dot-size')
        );

        dot.style.position = 'absolute';
        dot.style.left = `${this.x - size / 2}px`;
        dot.style.top  = `${this.y - size / 2}px`;

        dot.appendChild(label);
        return dot;
    }

    getName() {
        return this.#name;
    }

    setName(new_name) {
        if (new_name.length > JS_VARS.DOT_NAME_MAXLENGTH) {
            throw (`Station name max length: ${JS_VARS.DOT_NAME_MAXLENGTH} characters`)
        }
        this.#name = new_name;
        this.label.textContent = this.#name;
    }
}