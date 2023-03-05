export default interface OrderRepository {
    save(order: any): Promise<any>;
    getById(id: string): Promise<any>; 
    count(): Promise<number>;
}