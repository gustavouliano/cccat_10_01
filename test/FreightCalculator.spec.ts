import FreightCalculator from "../src/domain/entity/FreightCalculator";
import Product from "../src/domain/entity/Product";

it('Deve calcular o frete do produto de um item com quantidade 1', () => {
    const product = new Product(5, 'A', 1000, 100, 30, 10, 3, 'USD');
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(30);
})

it('Deve calcular o frete do produto de um item com quantidade 3', () => {
    const product = new Product(5, 'A', 1000, 100, 30, 10, 3, 'USD');
    const freight = FreightCalculator.calculate(product, 3);
    expect(freight).toBe(90);
})

it('Deve calcular o frete do produto com preço mínimo', () => {
    const product = new Product(5, 'C', 1000, 10, 10, 10, 0.9, 'USD');
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(10);
})
