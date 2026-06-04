import { Coordinate } from "../canvas/Interfaces";

export function getDistance(posA: Coordinate, posB: Coordinate) {
    const dx = posA.x - posB.x;
    const dy = posA.y - posB.y;
    
    return Math.sqrt(dx * dx + dy * dy);
}
