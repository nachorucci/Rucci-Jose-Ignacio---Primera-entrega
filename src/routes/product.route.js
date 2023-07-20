const express = require("express");
const productRouter = express.Router()
const {Product} = require("../model/product")
const {ProductManager} = require("../managers/productManager")

const productManager = new ProductManager("./src/resources/products.json")

productRouter.get('', (req, res) => {
    let limit = Number(req.query.limit)
    if (isNaN(limit)) {
        limit = -1
    }

    let data = productManager.getProducts(limit)
    console.log(data)

    res.send(productManager.getProducts(limit))
})
productRouter.get('/:pid', (req, res) => {
    let idBuscado = req.params['pid']
    let resultado = productManager.getProductById(idBuscado)
    res.send(resultado)
})
productRouter.delete('/:pid', (req, res) => {
    let idBuscado = req.params['pid']
    res.status(productManager.deleteProduct(idBuscado)).send()
})
productRouter.post('', (req, res) => {
    if (areParamsValid(req.body)) {
        let product = new Product(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock, req.body.category, req.body.status)

        res.status(productManager.addProduct(product)).send()
    } else {
        res.status(500).send({'message': 'missing mandatory parameter'}).end()
    }
})
productRouter.put('/:pid', (req, res) => {
    let idBuscado = req.params['pid']

    let product = new Product(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock, req.body.category, req.body.status)

    res.status(productManager.updateProduct(idBuscado, product)).send()
})

function areParamsValid(body) {
    return !(body.title == null || body.description == null || body.price == null || body.code == null || body.stock == null || body.category == null);
}

module.exports = {productRouter}