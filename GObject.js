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
        if (this.tick) {
            this.tick(dt)
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    __preDraw(ctx) {
        if (!this.draw) return

        let rotPoint = new GPoint(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2)
        let rotationAngleRadians = this.rotation * Math.PI / 180
    
        var cos = Math.cos(rotationAngleRadians);
        var sin = Math.sin(rotationAngleRadians);
        var a = cos;
        var b = sin;
        var c = -sin;
        var d = cos;
        var e = rotPoint.x - cos * rotPoint.x + sin * rotPoint.y;
        var f = rotPoint.y - cos * rotPoint.y - sin * rotPoint.x;
    
        ctx.setTransform(a, b, c, d, e, f)

        this.draw(ctx)

        ctx.setTransform(1, 0, 0, 1, 0, 0)
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

    /**
     * @type CanvasRenderingContext2D
     * @private
     */
    static context = document.querySelector("canvas").getContext("2d")

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

    /**
     * @param {GObject} object 
     */
    static removeObject(object) {
        if (!(object instanceof GObject)) throw(new TypeError("object is not a GObject!"))
        GTicker.objects.splice(GTicker.objects.indexOf(object), 1)
    }

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    static setContext(canvas) {
        GTicker.context = canvas.getContext("2d")
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

        if (GTicker.context) {
            GTicker.context.clearRect(0, 0, GTicker.context.canvas.width, GTicker.context.canvas.height)
            GTicker.objects
                .sort((a, b) => a.drawZ - b.drawZ)
                .forEach(object => object.__preDraw(GTicker.context))
        }
    }
}
