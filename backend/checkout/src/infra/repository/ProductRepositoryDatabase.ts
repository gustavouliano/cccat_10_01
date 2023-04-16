import pgp from "pg-promise";
import Product from "../../domain/entity/Product";
import ProductRepository from "../../application/repository/ProductRepository";
import Connection from "../database/Connection";

export default class ProductRepositoryDatabase implements ProductRepository {

    constructor(readonly connection: Connection){

    }

    async getProduct(idProduct: number): Promise<Product> {
        const [productData] = await this.connection.query('select * from cccat10.product where id_product = $1', [idProduct]);
        return new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight), productData.currency)
    }
}