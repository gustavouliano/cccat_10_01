import pgPromise from "pg-promise";
import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import ValidateCoupon from "../../src/application/usecase/ValidateCoupon";
import PgPromise from "../../src/infra/database/PgPromiseAdapter";

let connection: Connection;
let couponRepository: CouponRepository;
let validateCoupon: ValidateCoupon;

beforeEach(() => {
    connection = new PgPromise();
    couponRepository = new CouponRepositoryDatabase(connection);
    validateCoupon = new ValidateCoupon(couponRepository);
});

afterEach(async () => {
    await connection.close();
})

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