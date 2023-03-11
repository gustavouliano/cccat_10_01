import Order from "../src/Order";
import crypto from 'crypto';
import Product from "../src/Product";
import CurrencyTable from "../src/CurrencyTable";

it('Não deve criar um pedido com cpf inválido', () => {
    const uuid = crypto.randomUUID();
    const cpf = '406.302.170-27';
    expect(() => new Order(uuid, cpf)).toThrow(new Error('Invalid cpf'));       
});

it('Deve criar um pedido vazio', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const order = new Order(uuid, cpf);
    expect(order.getTotal()).toBe(0);       
});

it('Deve criar um pedido com 3 itens', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const order = new Order(uuid, cpf);
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22, 'BRL'), 1);
    order.addItem(new Product(3, 'C', 30, 10, 10, 10, 0.9, 'BRL'), 3);
    expect(order.getTotal()).toBe(6090);
});

it('Não deve adicionar item duplicado', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const order = new Order(uuid, cpf);
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    expect(() => {
        order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    }).toThrow(new Error('Duplicated item'));
});

it('Não deve adicionar item com quantidade menor ou igual a 0', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const order = new Order(uuid, cpf);
    expect(() => {
        order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), -1);
    }).toThrow(new Error('Invalid quantity'));
});

it('Deve criar um pedido com 3 itens sendo um em dólar', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const currencyTable = new CurrencyTable();
    currencyTable.addCurrency('USD', 3);
    const order = new Order(uuid, cpf, currencyTable);
    order.addItem(new Product(1, 'A', 1000, 100, 30, 10, 3, 'BRL'), 1);
    order.addItem(new Product(2, 'B', 5000, 50, 50, 50, 22, 'USD'), 1);
    order.addItem(new Product(3, 'C', 30, 10, 10, 10, 0.9, 'BRL'), 3);
    expect(order.getTotal()).toBe(16090);
});

it('Deve criar um pedido e gerar o código', () => {
    const uuid = crypto.randomUUID();
    const cpf = '407.302.170-27';
    const order = new Order(uuid, cpf, new CurrencyTable(), 1, new Date('2023-10-01T10:00:00'));
    expect(order.getCode()).toBe('202300000001');
});