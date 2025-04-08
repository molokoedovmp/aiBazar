declare module "yookassa" {
  export default class YooKassa {
    constructor(options: { shopId: string; secretKey: string });
    
    // Правильный метод для получения платежа
    getPayment(paymentId: string): Promise<Payment>;
    
    // Правильный метод из документации
    getPayments(params: {
      created_at?: {
        gte?: string;
        lte?: string;
      };
      status?: string;
      limit?: number;
      cursor?: string;
    }): Promise<{
      items: Payment[];
      next_cursor?: string;
    }>;
    
    // Добавляем метод для получения списка платежей
    listPayments(params?: any): Promise<PaymentList>;
    
    createPayment(options: {
      amount: {
        value: string;
        currency: string;
      };
      capture: boolean;
      confirmation: {
        type: string;
        return_url: string;
      };
      description: string;
      metadata?: any;
      receipt?: {
        customer: {
          email: string;
        };
        items: Array<{
          description: string;
          quantity: string;
          amount: {
            value: string;
            currency: string;
          };
          vat_code: string;
          payment_subject: string;
          payment_mode: string;
        }>;
      };
    }): Promise<any>;
  }
  
  interface Payment {
    id: string;
    status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
    paid: boolean;
    amount: {
      value: string;
      currency: string;
    };
    metadata?: Record<string, any>;
    confirmation?: {
      type: string;
      confirmation_url: string;
    };
  }
  
  interface PaymentList {
    items: Payment[];
  }
} 