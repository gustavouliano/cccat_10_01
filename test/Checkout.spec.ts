import Sinon from "sinon";
import Checkout from "../src/Checkout";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import CurrencyGateway from "../src/CurrencyGateway";
import CurrencyGatewayHttp from "../src/CurrencyGatewayHttp";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";

let checkout: Checkout; 
beforeEach(() => {
    checkout = new Checkout();
});

it('Não deve aceitar um pedido com cpf inválido', async () => {
    const input = {
        cpf: '406.302.170-27',
        items: []
    }
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid cpf'));
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
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ]
    }
    const output = await checkout.execute(input);
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
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid quantity'));
});

it('Não deve criar um pedido com item duplicado', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 1, quantity: 1}
        ]
    }
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Duplicated item'));
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
    expect(() => checkout.execute(input)).rejects.toThrow(new Error('Invalid dimension'));
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
        .resolves({
            idProduct: 5,
            description: 'A',
            price: 1000,
            width: 10,
            height: 10,
            length: 10,
            weight: 10,
            currency: 'USD'
        });
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
            return {
                idProduct: 5, description: 'A', price: 1000, width: 10,
                height: 10, length: 10, weight: 10, currency: 'USD'
            };
        },
    }
    checkout = new Checkout(currencyGateway, productRepository);
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 5, quantity: 1}
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
});