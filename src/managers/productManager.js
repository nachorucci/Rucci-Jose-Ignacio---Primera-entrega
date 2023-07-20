const fs = require("fs");


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


module.exports = {ProductManager}