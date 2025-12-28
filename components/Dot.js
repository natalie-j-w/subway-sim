import {CSS_VARS} from '../constants.js'

const dotSize = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue('--dot-size')
);

export class DotView {
    constructor(stationData) {
        this.data = stationData;
        this.element = this.createDOMElement();
        this.label;
        this.element.dotInstance = this;
    }

    updatePosition(newX, newY) {
        this.data.x = newX;
        this.data.y  = newY;


        this.element.style.left = `${newX - dotSize / 2}px`;
        this.element.style.top  = `${newY - dotSize / 2}px`;
    }

    createDOMElement() {
        const dot = document.createElement('div');
        const label = document.createElement('div');

        dot.className = CSS_VARS.DOT_CLASSNAME;
        label.className = CSS_VARS.DOT_LABEL_CLASSNAME;

        this.label = label;
        label.textContent = this.data.getName();

        dot.style.position = 'absolute';
        dot.style.left = `${this.data.x - dotSize / 2}px`;
        dot.style.top  = `${this.data.y - dotSize / 2}px`;

        dot.appendChild(label);
        return dot;
    }

    setLabel(newName) {
        this.data.setName(newName);
        this.element.label.textContent = this.data.getName();
    }

    toggleLabelVisibility(value) {
        this.label.style.display = value ? 'block': 'none';
    }
}