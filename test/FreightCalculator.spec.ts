import FreightCalculator from "../src/FreightCalculator";

it('Deve calcular o frete do protudo', () => {
    const product = {
        idProduct: 5, description: 'A', price: 1000, width: 100,
        height: 30, length: 10, weight: 3, currency: 'USD'
    };
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(30);
})