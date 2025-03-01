import { Suspense } from 'react';
import PaymentPage from "@/app/(payment)/_components/payment";

export default function Payment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
