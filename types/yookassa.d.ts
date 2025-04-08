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