import express, { Request, Response } from 'express';
import Checkout from './application/usecase/Checkout';
import CurrencyGatewayHttp from './infra/gateway/CurrencyGatewayHttp';
import ProductRepositoryDatabase from './infra/repository/ProductRepositoryDatabase';
import PgPromise from './infra/database/PgPromiseAdapter';
import CouponRepositoryDatabase from './infra/repository/CouponRepositoryDatabase';
import OrderRepositoryDatabase from './infra/repository/OrderRepositoryDatabase';
import AxiosAdapter from './infra/http/AxiosAdapter';
const app = express();

app.use(express.json());

app.post('/checkout', async (req: Request, res: Response) => {
    try {
        const connection = new PgPromise();
        const httpClient = new AxiosAdapter();
        const currencyGateway = new CurrencyGatewayHttp(httpClient);
        const productRepository = new ProductRepositoryDatabase(connection);
        const couponRepository = new CouponRepositoryDatabase(connection);
        const orderRepository = new OrderRepositoryDatabase(connection);
        const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
        const output = await checkout.execute(req.body);
        await connection.close();
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        })
    }
});

app.listen(3000, () => {
    console.log('Listening at port 3000...');
});
