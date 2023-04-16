import Sinon from "sinon";
import Checkout from "../../src/application/usecase/Checkout";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import CurrencyGateway from "../../src/application/gateway/CurrencyGateway";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import ProductRepository from "../../src/application/repository/ProductRepository";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import crypto from 'crypto';
import GetOrder from "../../src/application/usecase/GetOrder";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import Product from "../../src/domain/entity/Product";
import PgPromise from "../../src/infra/database/PgPromiseAdapter";
import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import OrderRepository from "../../src/application/repository/OrderRepository";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";

let checkout: Checkout;
let getOrder: GetOrder;
let connection: Connection;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;
let orderRepository: OrderRepository;

beforeEach(() => {
    connection = new PgPromise();
    const httpClient = new AxiosAdapter();
    const currencyGateway = new CurrencyGatewayHttp(httpClient);
    productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    getOrder = new GetOrder(orderRepository);
});

afterEach(async () => {
    await connection.close();
});

it('Não deve aceitar um pedido com cpf inválido', async () => {
    const input = {
        cpf: '406.302.170-27',
        items: []
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid cpf'));
});

it('Deve criar um pedido vazio', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: []
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(0);
});

it('Deve criar um pedido com 3 produtos', async () => {
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ]
    }
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.total).toBe(6090);
});

it('Deve criar um pedido com 3 produtos com cupom de desconto', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ],
        coupon: 'VALE20'
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
});

it('Deve criar um pedido com 3 produtos com cupom de desconto expirado', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ],
        coupon: 'VALE10'
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

it('Não deve criar um pedido com quantidade negativa', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: -1}
        ]
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid quantity'));
});

it('Não deve criar um pedido com item duplicado', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 1, quantity: 1}
        ]
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Duplicated item'));
});

it('Deve criar um pedido com 1 produto calculando o frete', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 3}
        ],
        from: '22060030',
        to: '88015600'
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(90);
    expect(output.total).toBe(3090);
});

it('Não deve criar um pedido se o produto tiver alguma dimensão negativa', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 4, quantity: 1}
        ]
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid dimension'));
});

it('Deve criar um pedido com 1 produto calculando o frete com valor mínimo', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 3, quantity: 1}
        ],
        from: '22060030',
        to: '88015600'
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

it('Deve criar um pedido com 1 produto em dólar usando um stub', async () => {
    /**
     * Utilizando test pattern stub para basicamente sobrescrever o retorno de uma função.
     * Nesse caso sobrescrevendo o retorno da API que retorna a cotação do dólar.
     */
    const stubCurrencyGateway = Sinon.stub(CurrencyGatewayHttp.prototype, 'getCurrencies');
    stubCurrencyGateway.resolves({
        usd: 3
    });
    const stubProductRepository = Sinon.stub(ProductRepositoryDatabase.prototype, 'getProduct')
        .resolves(new Product(5, 'A', 1000, 10, 10, 10, 10, 'USD'));
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 5, quantity: 1}
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    stubCurrencyGateway.restore();
    stubProductRepository.restore();
});

it('Deve criar um pedido com 3 produtos com cupom de desconto com spy', async () => {
    const spyProductRepository = Sinon.spy(ProductRepositoryDatabase.prototype, 'getProduct');
    const spyCouponRepository = Sinon.spy(CouponRepositoryDatabase.prototype, 'getCoupon');
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ],
        coupon: 'VALE20'
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
    expect(spyProductRepository.calledThrice).toBeTruthy();
    expect(spyCouponRepository.calledOnce).toBeTruthy();
    expect(spyCouponRepository.calledWith('VALE20')).toBeTruthy();
    spyProductRepository.restore();
    spyCouponRepository.restore();
});

it('Deve criar um pedido com 1 produto em dólar usando um mock', async () => {
    const mockCurrencyGateway = Sinon.mock(CurrencyGatewayHttp.prototype);
    mockCurrencyGateway.expects('getCurrencies').atLeast(1).resolves({
        usd: 3
    });
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 5, quantity: 1}
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    mockCurrencyGateway.verify();
    mockCurrencyGateway.restore();
});

it('Deve criar um pedido com 1 produto em dólar usando um fake', async () => {
    const currencyGateway: CurrencyGateway = {
        async getCurrencies(): Promise<any> {
            return {
                usd: 3
            };
        },
    }
    const productRepository: ProductRepository = {
        async getProduct(idProduct: number): Promise<any> {
            return new Product(5, 'A', 1000, 10, 10, 10, 10, 'USD');
        },
    }
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 5, quantity: 1}
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
});

it('Deve criar um pedido e verificar o código de série', async () => {
    const stub = Sinon.stub(OrderRepositoryDatabase.prototype, 'count').resolves(1);
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ]
    }
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.code).toBe('202300000001');
    stub.restore();
});