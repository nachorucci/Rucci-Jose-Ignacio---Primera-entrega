const express = require("express");
const cartRouter = express.Router()
const {Cart} = require("../model/cart")
const {CartManager} = require("../managers/cartManager")

const cartManager = new CartManager("./src/resources/carts.json")

cartRouter.post('', (req, res) => {
    let cart = new Cart(req.body.products)
    res.status(cartManager.createCart(cart)).send()
})
cartRouter.get('/:cid', (req, res) => {
    let idBuscado = req.params['cid']
    res.send(cartManager.getCart(idBuscado))
})
cartRouter.post('/:cid/product/:pid', (req, res) => {
    let cartId = req.params['cid']
    let productId = req.params['pid']

    res.send(cartManager.addProductToCart(cartId, productId))
})

module.exports = {cartRouter}