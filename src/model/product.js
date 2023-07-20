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

module.exports = {Product}
