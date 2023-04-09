import CouponRepository from '../repository/CouponRepository';
import CouponRepositoryDatabase from '../../infra/repository/CouponRepositoryDatabase';


export default class ValidateCoupon {

    constructor(
        readonly couponRepository: CouponRepository
    ){}

    public async execute(code: string): Promise<boolean> {
        const couponData = await this.couponRepository.getCoupon(code);
        return !couponData.isExpired(new Date());
    }
}