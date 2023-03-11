import FreightCalculator from "../src/domain/entity/FreightCalculator";
import Product from "../src/domain/entity/Product";

it('Deve calcular o frete do protudo', () => {
    const product = new Product(5, 'A', 1000, 100, 30, 10, 3, 'USD');
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(30);
})