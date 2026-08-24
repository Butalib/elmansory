export interface IOrder {
    id: string;
    orderCode: string;
    customerName: string;
    itemCount: number;
    createdAt: string;
    isActive: boolean;
    status: 'pending' | 'accepted' | 'rejected';
    customerAvatar: string;
    orderType: 'ملازم' | 'حجز الكترونى' | 'جهز نفسك للمدرسة';
    discount: number; // Assuming discount is a number, you can adjust the type as needed
}
export interface IOrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    type: string;
}

export interface IOrderCustomer {
    name: string;
    phone: string;
    email: string;
    governorate: string;
    area: string;
    address: string;
}
export interface IOrderDetails extends IOrder {
    customer: IOrderCustomer;
    items: IOrderItem[];
}