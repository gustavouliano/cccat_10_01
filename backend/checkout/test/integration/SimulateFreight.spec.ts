import Connection from "../../src/infra/database/Connection";
import PgPromise from "../../src/infra/database/PgPromiseAdapter";
import ProductRepository from "../../src/application/repository/ProductRepository";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import SimulateFreight from "../../src/application/usecase/SimulateFreight";

let connection: Connection;
let simulateFreight: SimulateFreight;
let productRepository: ProductRepository;
beforeEach(() => {
    connection = new PgPromise();
    productRepository = new ProductRepositoryDatabase(connection);
    simulateFreight = new SimulateFreight(productRepository);
});

afterEach(async () => {
    await connection.close();
})

it('Deve calcular o frete para um pedido com 3 itens', async () => {
    const input = {
        cpf: '407.302.170-27',
        items: [
            { idProduct: 1, quantity: 1},
            { idProduct: 2, quantity: 1},
            { idProduct: 3, quantity: 3}
        ],
        from: '22060030',
        to: '88015600'
    };
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280);
});
