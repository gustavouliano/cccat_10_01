import pgp from "pg-promise";
import Coupon from "./Coupon";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository {
    
    async getCoupon(code: string): Promise<Coupon> {
        const connection = pgp()('postgres://postgres:gustavo123@localhost:5432/app_branas');
        const [couponData] = await connection.query('select * from cccat10.coupon where code = $1', [code]);
        await connection.$pool.end();
        return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date); 
    }
}