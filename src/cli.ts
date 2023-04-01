import Checkout from './application/usecase/Checkout';

const input: Input = {
    items: [],
    cpf: ''
}
process.stdin.on('data', async (chunck) => {
    const command = chunck.toString().replace(/\n/g, '');
    if (command.includes('set-cpf')){
        input.cpf = command.replace('set-cpf ', '').replace('\r', '');
    }
    if (command.includes('add-item')){
        const [idProduct, quantity] = command.replace('add-item ', '').split(' ');
        input.items.push({
            idProduct: parseInt(idProduct),
            quantity: parseInt(quantity)
        });
    }
    if (command.includes('checkout')){
        try {
            const checkout = new Checkout();
            const output = await checkout.execute(input);
            console.log(output);
        } catch (e: any) {
            console.log(e.message);
        }
    }
})

type Input = {
    cpf: string;
    items: { idProduct: number, quantity: number }[];
    coupon?: string;
    from?: string;
    to?: string;
}