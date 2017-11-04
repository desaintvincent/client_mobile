export default class Point3D {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    }

    add(o = { x: 0, y: 0, z: 0 }) {
        this.x = this.x + o.x;
        this.y = this.y + o.y;
        this.z = this.z + o.z;

        return { x: this.x, y: this.y, z: this.z };
    }

    sub(o = {x: 0, y: 0, z: 0}) {
        this.x = this.x - o.x;
        this.y = this.y - o.y;
        this.z = this.z - o.z;

        return { x: this.x, y: this.y, z: this.z };
    }

    times(o = {x: 0, y: 0, z: 0}) {
        this.x = this.x * o.x;
        this.y = this.y * o.y;
        this.z = this.z * o.z;

        return { x: this.x, y: this.y, z: this.z };
    }

    divide(o = {x: 0, y: 0, z: 0}) {
        this.x = this.x / o.x;
        this.y = this.y / o.y;
        this.z = this.z / o.z;

        return { x: this.x, y: this.y, z: this.z };
    }

    set(o = {x: 0, y: 0, z: 0}) {
        this.x = o.x;
        this.y = o.y;
        this.z = o.z;

        return { x: this.x, y: this.y, z: this.z };
    }

    is(o = {x: 0, y: 0, z: 0}) {
        return (this.x === o.x && this.y === o.y);
    }
}
