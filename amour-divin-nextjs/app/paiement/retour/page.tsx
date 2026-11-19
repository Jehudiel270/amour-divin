import PaymentReturnStatus from "@/components/shared/payment-return-status";

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string }>;
}) {
  const { payment_id: paymentId } = await searchParams;
  if (!paymentId) {
    return <div className="mx-auto max-w-lg px-6 py-24 text-center text-sm text-slate-600">Aucun paiement à vérifier.</div>;
  }
  return <PaymentReturnStatus paymentId={paymentId} />;
}
