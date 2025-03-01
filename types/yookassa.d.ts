declare module 'yookassa' {
  export default class YooKassa {
    constructor(options: { shopId: string; secretKey: string });
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
    }): Promise<any>;
    
    getPayment(paymentId: string): Promise<{
      status: string;
      paid: boolean;
      amount: {
        value: string;
        currency: string;
      };
      confirmation?: {
        type: string;
        confirmation_url: string;
      };
    }>;
  }
} 