export default class IsoMath {
    constructor() {
    }

    static isPointInPolygon(o, poly) {
        const x = o.x;
        const y = o.y;

        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0];
            const yi = poly[i][1];
            const xj = poly[j][0];
            const yj = poly[j][1];

            if (((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }

        return inside;
    }
}
