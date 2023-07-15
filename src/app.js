const express = require('express')
const app = express();
app.use(express.json())
const port = 8080
const fs = require("fs");

class Product {
    id
    title
    description
    price
    thumbnail
    code
    stock
    category
    status

    constructor(title, description, price, thumbnail = null, code, stock, category, status = true) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status;
    }
}

class Cart {
    id
    products

    constructor(products) {
        this.products = products;
    }
}

class ProductManager {
    path;

    constructor(path) {
        this.path = path;
    }

    addProduct(product) {
        let productos = JSON.parse(fs.readFileSync(this.path));
        let newProductId
        if (productos.length !== 0) {
            newProductId = productos.slice(productos.length - 1, productos.length)[0].id + 1
        } else {
            newProductId = 0
        }

        product.id = newProductId

        let i = 0
        while (i < productos.length) {
            i++;
        }

        productos[i] = product

        const jsonContent = JSON.stringify(productos);

        fs.writeFile(this.path, jsonContent, 'utf8', function (err) {
            if (err) {
                return 500
            }

            return 200
        });
        return 200
    }

    getProducts(limit) {
        let productos = JSON.parse(fs.readFileSync(this.path));

        if (limit > 0) {
            return productos.slice(0, limit)
        }

        return productos;
    }

    getProductById(idBuscado) {
        let productos = JSON.parse(fs.readFileSync(this.path))

        for (let i = 0; i < productos.length; i++) {
            let producto = productos[i];

            if (producto.id === Number(idBuscado)) {
                return producto;
            }
        }
        return {"mensaje": "Producto con id " + idBuscado + " no existe."}
    }

    updateProduct(productId, product) {
        let productos = JSON.parse(fs.readFileSync(this.path))

        let updated = false
        for (let i = 0; i < productos.length; i++) {
            let productoAlmacenado = productos[i];

            if (productoAlmacenado.id === Number(productId)) {
                productoAlmacenado.title = product.title != null ? product.title : productoAlmacenado.title
                productoAlmacenado.description = product.description != null ? product.description : productoAlmacenado.description
                productoAlmacenado.price = product.price != null ? product.price : productoAlmacenado.price
                productoAlmacenado.thumbnail = product.thumbnail != null ? product.thumbnail : productoAlmacenado.thumbnail
                productoAlmacenado.code = product.code != null ? product.code : productoAlmacenado.code
                productoAlmacenado.stock = product.stock != null ? product.stock : productoAlmacenado.stock
                productoAlmacenado.category = product.category != null ? product.category : productoAlmacenado.category
                productoAlmacenado.status = product.status != null ? product.status : productoAlmacenado.status

                updated = true
                productos[i] = productoAlmacenado
            }
        }

        if (updated) {
            const jsonContent = JSON.stringify(productos);
            fs.writeFile(this.path, jsonContent, 'utf8', function (err) {
                if (err) {
                    return 500
                }

                return 200
            });
            return 200
        }
        return 404
    }

    deleteProduct(productId) {
        let productos = JSON.parse(fs.readFileSync(this.path));

        let i = 0
        let found = false
        for (i; i < productos.length; i++) {
            let producto = productos[i];

            if (producto.id === Number(productId)) {
                found = true
                break
            }
        }

        if (found) {
            productos.splice(i, 1)
            const jsonContent = JSON.stringify(productos);
            fs.writeFile(this.path, jsonContent, 'utf8', function (err) {
                if (err) {
                    return 500
                }
            });
            return 200
        }

        return 404
    }
}

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

const productManager = new ProductManager('../resources/products.json')
const cartManager = new CartManager('../resources/carts.json')

//Products
app.get('/api/products', (req, res) => {
    let limit = Number(req.query.limit)
    if (isNaN(limit)) {
        limit = -1
    }

    res.send(productManager.getProducts(limit))
})
app.get('/api/products/:pid', (req, res) => {
    let idBuscado = req.params['pid']
    let resultado = productManager.getProductById(idBuscado)
    res.send(resultado)
})
app.delete('/api/products/:pid', (req, res) => {
    let idBuscado = req.params['pid']
    res.status(productManager.deleteProduct(idBuscado)).send()
})
app.post('/api/products', (req, res) => {
    if (areParamsValid(req.body)) {
        let product = new Product(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock, req.body.category, req.body.status)

        res.status(productManager.addProduct(product)).send()
    } else {
        res.status(500).send({'message': 'missing mandatory parameter'}).end()
    }
})
app.put('/api/products/:pid', (req, res) => {
    let idBuscado = req.params['pid']

    let product = new Product(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock, req.body.category, req.body.status)

    res.status(productManager.updateProduct(idBuscado, product)).send()
})

//Carts
app.post('/api/carts', (req, res) => {
    let cart = new Cart(req.body.products)
    res.status(cartManager.createCart(cart)).send()
})
app.get('/api/carts/:cid', (req, res) => {
    let idBuscado = req.params['cid']
    res.send(cartManager.getCart(idBuscado))
})
app.post('/api/carts/:cid/product/:pid', (req, res) => {
    let cartId = req.params['cid']
    let productId = req.params['pid']

    res.send(cartManager.addProductToCart(cartId, productId))
})

function areParamsValid(body) {
    return !(body.title == null || body.description == null || body.price == null || body.code == null || body.stock == null || body.category == null);

}

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})