class Something extends GObject {
    constructor(position, size) {
        super(position, size)
    }

    tick(dt) {

    }

    draw() {
        
    }
}

new Something(
    new GPoint(0, 0),
    new GRect(0, 0)
)
