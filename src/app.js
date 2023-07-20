const express = require('express')
const app = express();
app.use(express.json())
const port = 8080

const {productRouter} = require("./routes/product.route")
const {cartRouter} = require("./routes/carts.route")

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})