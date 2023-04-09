import Checkout from "../../application/usecase/Checkout";
import AxiosAdapter from "../http/AxiosAdapter";
import CLIHandler from "./CLIHandler";
import CouponRepositoryDatabase from "../repository/CouponRepositoryDatabase";
import CurrencyGatewayHttp from "../gateway/CurrencyGatewayHttp";
import OrderRepositoryDatabase from "../repository/OrderRepositoryDatabase";
import PgPromise from "../database/PgPromiseAdapter";
import ProductRepositoryDatabase from "../repository/ProductRepositoryDatabase";

export default class CLIController {
    constructor(readonly handler: CLIHandler, readonly checkout: Checkout){
        const input: Input = {
            items: [],
            cpf: ''
        }
        handler.on('set-cpf', (params: any) => {
            input.cpf = params;
        });
        handler.on('add-item', (params: any) => {
            const [idProduct, quantity] = params.split(' ');
            input.items.push({idProduct: parseInt(idProduct), quantity: parseInt(quantity)});
        });
        handler.on('checkout', async (params: any) => {
            try {
                const connection = new PgPromise();
                const httpClient = new AxiosAdapter();
                const currencyGateway = new CurrencyGatewayHttp(httpClient);
                const productRepository = new ProductRepositoryDatabase(connection);
                const couponRepository = new CouponRepositoryDatabase(connection);
                const orderRepository = new OrderRepositoryDatabase(connection);
                const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
                const output = await checkout.execute(input);
                handler.write(JSON.stringify(output));
            } catch (e: any) {
                handler.write(e.message);
            }
        });
    }
}

type Input = {
    cpf: string;
    items: { idProduct: number, quantity: number }[];
    coupon?: string;
    from?: string;
    to?: string;
}