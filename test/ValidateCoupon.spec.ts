import ValidateCoupon from "../src/application/usecase/ValidateCoupon";

let validateCoupon: ValidateCoupon;

beforeEach(() => {
    validateCoupon = new ValidateCoupon();
});

it('Deve validar um cupom de desconto', async () => {
    const input = 'VALE20';
    const output = await validateCoupon.execute(input);
    expect(output).toBeTruthy();
});

it('Deve validar um cupom de desconto expirado', async () => {
    const input = 'VALE10';
    const output = await validateCoupon.execute(input);
    expect(output).toBeFalsy();
});