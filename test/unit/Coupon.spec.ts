import Coupon from "../../src/domain/entity/Coupon";

it('Deve criar um cupom de desconto válido', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.isExpired(new Date('2023-02-01T10:00:00'))).toBeFalsy();
});

it('Deve criar um cupom de desconto inválido', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.isExpired(new Date('2023-12-01T10:00:00'))).toBeTruthy()
});

it('Deve calcular o desconto', () => {
    const coupon = new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.calculateDiscount(1000)).toBe(200);
});