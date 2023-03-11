import Cpf from "./Cpf";
import CurrencyTable from "./CurrencyTable";
import Item from "./Item";
import Product from "./Product";
import crypto from "crypto";

export default class Order {
    readonly items: Item[];
    readonly cpf: Cpf;
    readonly code: string;
    public freight: number = 0;

    constructor(readonly idOrder: string | undefined, cpf: string, readonly currencyTable: CurrencyTable = new CurrencyTable(), readonly sequence: number = 1, readonly date: Date = new Date()) {
        if (!idOrder) this.idOrder = crypto.randomUUID();
        this.items = [];
        this.cpf = new Cpf(cpf);
        this.code = `${date.getFullYear()}${new String(sequence).padStart(8, '0')}`;
    }

    addItem(product: Product, quantity: number): void {
        if (quantity <= 0) throw new Error('Invalid quantity');
        if (this.items.some((item: Item) => item.idProduct === product.idProduct)) throw new Error('Duplicated item')
        this.items.push(new Item(product.idProduct, product.price, quantity, product.currency));
    }

    getCode(){
        return this.code;
    }

    getTotal(): number {
        let total = 0;
        for (const item of this.items){
            total += item.price * item.quantity * this.currencyTable.getCurrency(item.currency);
        }
        total += this.freight;
        return total;
    }
}