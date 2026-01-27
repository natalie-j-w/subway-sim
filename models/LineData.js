
// TODO: Implement LineData
// TODO: Documentation

export class LineData {
    
    constructor(name="Unnamed Line", color="blue") {
        if ((typeof color !== 'string')) {
            throw TypeError(`Color ${color} is not of type string`);
        }
        
        if (!CSS.supports("color", color)) {  
            throw TypeError("Color has to be a valid CSS color");
        
        }
        this.name = name;
        this.color = color;
        this.tracks = [];
    }
}