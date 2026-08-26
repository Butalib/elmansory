export interface IProfits {
    id: string;
    productName: string;
    productImage: string;
    availableQuantity: string;
    originalPrice: string;
    consumerPrice: string;
    ordersCount: number;
    totalProfit: string;
    netProfit: number;
    date: string; // Assuming you have a date field for sorting
}