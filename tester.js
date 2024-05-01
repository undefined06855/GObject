class Something extends GObject {
    constructor(position, size) {
        super(position, size)
    }

    /**
     * @param {Number} dt 
     */
    tick(dt) {
        this.rotation += dt / 10
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}

new Something(
    new GPoint(0, 0),
    new GRect(10, 20)
)
