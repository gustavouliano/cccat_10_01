import CouponRepository from './CouponRepository';
import CouponRepositoryDatabase from './CouponRepositoryDatabase';
import CurrencyGateway from './CurrencyGateway';
import CurrencyGatewayHttp from './CurrencyGatewayHttp';
import OrderRepository from './OrderRepository';
import OrderRepositoryDatabase from './OrderRepositoryDatabase';
import ProductRepository from './ProductRepository';
import ProductRepositoryDatabase from './ProductRepositoryDatabase';
import { validate } from './validator';

export default class ValidateCoupon {

    constructor(
        readonly couponRepository: CouponRepository = new CouponRepositoryDatabase()
    ){}

    public async execute(code: string): Promise<boolean> {
        const couponData = await this.couponRepository.getCoupon(code);
        return (couponData.expire_date.getTime() > new Date().getTime());
    }
}