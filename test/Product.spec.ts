import Product from "../src/Product";

it('Não deve criar um produto com dimensões inválidas', () => {
    expect(() => new Product(1, 'A', 1000, -10, -10, -10, -10, 'BRL')).toThrow(new Error('Invalid dimension'));
});