class GPoint {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class GRect {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width
        this.height = height
    }
}

class GObject {
    /**
     * @param {GPoint} position 
     * @param {GRect} size 
     */
    constructor(position, size) {
        if (!(position instanceof GPoint)) throw(new TypeError("position is not a GPoint!"))
        if (!(size instanceof GRect)) throw(new TypeError("size is not a GRect!"))
        this.position = position
        this.size = size
        this.drawZ = 0
        this.tickZ = 0
        this.rotation = 0

        GTicker.addObject(this)
    }

    /**
     * @param {number} dt
     */
    __preTick(dt) {
        let rotPoint = new GPoint(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2)

        if (this.tick) {
            this.tick(dt)
        }
    }

    __preDraw() {
        if (this.draw) {
            this.draw()
        }
    }
}

class GTicker {
    /**
     * @type Number
     * @private
     */
    static lastFrame = -1

    /**
     * @type Array<GObject>
     * @private
     */
    static objects = []

    static {
        function tick() {
            GTicker.__frame()
            requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
    }

    /**
     * @param {GObject} object 
     */
    static addObject(object) {
        if (!(object instanceof GObject)) throw(new TypeError("object is not a GObject!"))
        GTicker.objects.push(object)
    }

    static removeObject(object) {
        if (!(object instanceof GObject)) throw(new TypeError("object is not a GObject!"))
        GTicker.objects.splice(GTicker.objects.indexOf(object), 1)
    }

    /**
     * @private
     */
    static __frame() {
        let dt = performance.now() - GTicker.lastFrame
        GTicker.lastFrame = performance.now()

        GTicker.objects
            .sort((a, b) => a.tickZ - b.tickZ)
            .forEach(object => object.__preTick(dt))
        GTicker.objects
            .sort((a, b) => a.drawZ - b.drawZ)
            .forEach(object => object.__preDraw(dt))
    }
}
