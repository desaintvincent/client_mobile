export default class Point2D {
    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    add(o: any = { x: 0, y: 0 }) {
        this.x = this.x + o.x;
        this.y = this.y + o.y;

        return { x: this.x, y: this.y };
    }

    sub(o: any = {x: 0, y: 0}) {
        this.x = this.x - o.x;
        this.y = this.y - o.y;

        return { x: this.x, y: this.y };
    }

    times(o: any = {x: 0, y: 0}) {
        this.x = this.x * o.x;
        this.y = this.y * o.y;

        return { x: this.x, y: this.y };
    }

    divide(o: any = {x: 0, y: 0}) {
        this.x = this.x / o.x;
        this.y = this.y / o.y;

        return { x: this.x, y: this.y };
    }

    set(o: any = {x: 0, y: 0}) {
        this.x = o.x;
        this.y = o.y;

        return { x: this.x, y: this.y };
    }

    is(o: any = {x: 0, y: 0}) {
        return (this.x === o.x && this.y === o.y);
    }
}
