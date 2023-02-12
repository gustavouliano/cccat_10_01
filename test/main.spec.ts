import axios from "axios";

it('Não deve aceitar um pedido com cpf inválido', async () => {
    const input = {
        cpf: '406.302.170-27'
    }
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
    expect(output.message).toBe('Invalid cpf');
});

it('Deve criar um pedido vazio', async () => {
    const input = {
        cpf: '407.302.170-27'
    }
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
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
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
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
    const response = await axios.post('http://localhost:3000/checkout', input);
    const output = response.data;
    expect(output.total).toBe(4872);
});