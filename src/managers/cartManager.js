const fs = require("fs");


class CartManager {
    path;

    constructor(path) {
        this.path = path;
    }

    createCart(cart) {
        let carts = JSON.parse(fs.readFileSync(this.path));
        let newCartId
        if (carts.length !== 0) {
            newCartId = carts.slice(carts.length - 1, carts.length)[0].id + 1
        } else {
            newCartId = 0
        }

        cart.id = newCartId

        let i = 0
        while (i < carts.length) {
            i++;
        }

        carts[i] = cart

        const jsonContent = JSON.stringify(carts);

        fs.writeFile(this.path, jsonContent, 'utf8', function (err) {
            if (err) {
                return 500
            }

            return 200
        });
        return 200
    }

    getCart(cartId) {
        let carts = JSON.parse(fs.readFileSync(this.path))

        for (let i = 0; i < carts.length; i++) {
            let cart = carts[i];

            if (cart.id === Number(cartId)) {
                return cart;
            }
        }
        return {"mensaje": "Carrito con id " + cartId + " no existe."}
    }

    addProductToCart(cartId, productId) {
        let carts = JSON.parse(fs.readFileSync(this.path))

        for (let i = 0; i < carts.length; i++) {
            let cart = carts[i];

            let productUpdated = false
            if (cart.id === Number(cartId)) {
                let j = 0
                for (j; j < cart.products.length; j++) {
                    if (Number(cart.products[j].product) === Number(productId)) {
                        cart.products[j].quantity += 1
                        productUpdated = true
                        break
                    }
                }
                if (!productUpdated) {
                    cart.products[j] = {"product": Number(productId), "quantity": 1}
                    productUpdated = true
                }

                carts[i] = cart

                const jsonContent = JSON.stringify(carts);

                fs.writeFile(this.path, jsonContent, 'utf8', function (err) {
                    if (err !== null) {
                        return 500
                    }
                });
            }
            if (productUpdated) {
                return 204
            }
        }
        return 404
    }
}


module.exports = {CartManager}