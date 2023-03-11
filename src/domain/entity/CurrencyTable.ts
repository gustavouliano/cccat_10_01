export default class CurrencyTable {
    value: {[currency: string]: number};
    
    constructor() {
        this.value = {
            'BRL': 1
        };
    }

    addCurrency(currency: string, value: number): void {
        this.value[currency] = value;
    }

    getCurrency(currency: string): number {
        return this.value[currency];
    }
}