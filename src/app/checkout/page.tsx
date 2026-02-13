'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Loader2, CheckCircle2, Smartphone, XCircle } from 'lucide-react';
import { QPayQrDisplay } from '@/app/components/QPayQrDisplay';
import { useCart } from '@/app/context/CartContext';
import { createOrder, getOrder, validatePromoCode, type CreateOrderResponse, type ValidatePromoResponse } from '@/app/lib/api';
import { toast } from 'sonner';
import { Tag, X } from 'lucide-react';

const POLL_INTERVAL_MS = 3000;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<'city' | 'countryside'>('city');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [orderResult, setOrderResult] = useState<CreateOrderResponse | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<ValidatePromoResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const deliveryFee = deliveryMethod === 'city' ? 10000 : 15000;
  const discountAmount = appliedPromo?.valid && appliedPromo.discount_amount ? appliedPromo.discount_amount : 0;
  const grandTotal = Math.max(0, totalPrice + deliveryFee - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Сагс хоосон байна. Эхлээд бүтээгдэхүүн нэмнэ үү.');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Нэрээ оруулна уу.');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Утасны дугаараа оруулна уу.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress.trim() || undefined,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        })),
        promo_code: appliedPromo?.valid && appliedPromo.code ? appliedPromo.code : undefined,
      });
      setOrderResult(res);
      setStep('payment');
      clearCart();
      toast.success('Захиалга үүслээ. QPay-аар төлнө үү.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Захиалга үүсгэхэд алдаа гарлаа.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Төлбөрийн төлөв шалгах (QPay webhook төлөгдсөн бол автоматаар шинэчлэгдэнэ)
  useEffect(() => {
    if (step !== 'payment' || !orderResult?.order_id) return;
    const check = async () => {
      try {
        const order = await getOrder(orderResult.order_id);
        setOrderStatus(order.status);
        if (order.status === 'paid') {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch {
        // үл тоомжлор
      }
    };
    setOrderStatus(orderResult.status);
    if (orderResult.status !== 'paid') {
      check();
      pollRef.current = setInterval(check, POLL_INTERVAL_MS);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [step, orderResult?.order_id, orderResult?.status]);

  if (step === 'payment' && orderResult) {
    const qpay = orderResult.qpay;
    const isPaid = orderStatus === 'paid';
    return (
      <div className="min-h-screen bg-gray-50 pt-12 pb-12 animate-in fade-in duration-500">
        <div className="max-w-[600px] mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-6">
            <ArrowLeft className="size-4" />
            Нүүр хуудас
          </Link>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`size-12 rounded-full flex items-center justify-center ${isPaid ? 'bg-green-100' : 'bg-amber-100'}`}>
                {isPaid ? (
                  <CheckCircle2 className="size-6 text-green-600" />
                ) : (
                  <XCircle className="size-6 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-serif font-semibold">Захиалга #{orderResult.order_number}</h1>
                <p className="text-gray-500 text-sm">Нийт {orderResult.total.toLocaleString()}₮</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {isPaid ? 'Төлөгдлөө' : 'Төлбөр төлөгдөнгүй'}
              </div>
            </div>

            {!isPaid && (
              <>
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">QR кодыг уншуулж төлнө үү</p>
                <div className="mb-6">
                  <QPayQrDisplay qrImage={qpay.qr_image} qrCode={qpay.qr_code} size={220} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-3">Эсвэл банк / аппаа сонгоно уу:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {qpay.urls?.slice(0, 12).map((u, idx) => (
                    <a
                      key={idx}
                      href={u.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent/5 transition-colors"
                    >
                      {u.logo ? (
                        <img src={u.logo} alt={u.name} className="size-10 object-contain rounded" />
                      ) : (
                        <Smartphone className="size-10 text-gray-400" />
                      )}
                      <span className="text-xs font-medium text-center line-clamp-2">{u.name}</span>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mb-6">
                  Төлбөр төлсний дараа захиалга автоматаар «Төлөгдлөө» болно. Асуудал гарвал бид таньтай холбогдоно.
                </p>
              </>
            )}

            {isPaid && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg p-4 mb-6">
                Таны төлбөр амжилттай төлөгдлөө. Захиалга баталгаажлаа. Бид таньтай холбогдоно.
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <Link href="/products" className="flex-1 text-center py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
                Дэлгэрэнгүй үргэлжлүүлэх
              </Link>
              <Link href="/" className="flex-1 text-center py-3 rounded-lg bg-black text-white font-medium hover:bg-black/90 transition">
                Нүүр хуудас
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-4">
            <ArrowLeft className="size-4" />
            Дэлгүүр лүү буцах
          </Link>
          <h1 className="text-3xl font-serif">Захиалга баталгаажуулах</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center size-6 bg-black text-white rounded-full text-xs">1</span>
                  Холбоо барих мэдээлэл
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Нэр *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="Таны нэр"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Утасны дугаар *</label>
                    <input
                      type="tel"
                      required
                      maxLength={8}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="88888888"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">И-мэйл хаяг</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-black transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center size-6 bg-black text-white rounded-full text-xs">2</span>
                  Хүргэлтийн нөхцөл
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${deliveryMethod === 'city' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="delivery" className="mt-1" checked={deliveryMethod === 'city'} onChange={() => setDeliveryMethod('city')} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Хүргүүлж авах (УБ хот дотор)</span>
                        <span className="font-bold text-accent">10,000₮</span>
                      </div>
                      <p className="text-sm text-gray-500">Хотын A бүсэд хүргэлт хийгдэнэ.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${deliveryMethod === 'countryside' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="delivery" className="mt-1" checked={deliveryMethod === 'countryside'} onChange={() => setDeliveryMethod('countryside')} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Хөдөө орон нутгийн унаанд тавиулах</span>
                        <span className="font-bold text-accent">15,000₮</span>
                      </div>
                      <p className="text-sm text-gray-500">Унаанд тавьж өгөх үйлчилгээний хөлс.</p>
                    </div>
                  </label>
                </div>
                <div className="mt-4 space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    {deliveryMethod === 'city' ? 'Хүргэлтийн хаяг' : 'Унааны мэдээлэл'}
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded border border-gray-300 focus:outline-none focus:border-black transition-colors min-h-[80px]"
                    placeholder={deliveryMethod === 'city' ? 'Дүүрэг, хороо, байр, орц, тоот...' : 'Зогсоол, утас, машин...'}
                  />
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-medium mb-6">Захиалгын мэдээлэл</h2>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Сагс хоосон байна</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="size-16 bg-gray-100 rounded overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.quantity} x {item.price.toLocaleString()}₮</p>
                        </div>
                        <div className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()}₮</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Барааны үнэ</span>
                    <span>{totalPrice.toLocaleString()}₮</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Хүргэлт</span>
                    <span>{deliveryFee.toLocaleString()}₮</span>
                  </div>
                  {appliedPromo?.valid && discountAmount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Промо код ({appliedPromo.code})</span>
                      <span>-{discountAmount.toLocaleString()}₮</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-dashed border-gray-200">
                    <span>Нийт төлөх</span>
                    <span className="text-accent">{grandTotal.toLocaleString()}₮</span>
                  </div>
                </div>
                <div className="mb-6">
                  {appliedPromo?.valid ? (
                    <div className="flex items-center justify-between gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm font-medium text-green-800 flex items-center gap-2">
                        <Tag className="size-4" />
                        Промо код: {appliedPromo.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setAppliedPromo(null); setPromoInput(''); }}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        aria-label="Промо кодыг устгах"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Промо код оруулах"
                        className="flex-1 px-3 py-2.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                      <button
                        type="button"
                        disabled={promoLoading || !promoInput.trim() || items.length === 0}
                        onClick={async () => {
                          const code = promoInput.trim();
                          if (!code) return;
                          setPromoLoading(true);
                          try {
                            const result = await validatePromoCode(code, totalPrice);
                            if (result.valid) {
                              setAppliedPromo(result);
                              toast.success(`Промо код амжилттай хэрэглэгдлээ. -${(result.discount_amount ?? 0).toLocaleString()}₮`);
                            } else {
                              setAppliedPromo(null);
                              toast.error(result.error || 'Промо код буруу байна.');
                            }
                          } catch {
                            setAppliedPromo(null);
                            toast.error('Промо код шалгахад алдаа гарлаа.');
                          } finally {
                            setPromoLoading(false);
                          }
                        }}
                        className="px-4 py-2.5 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {promoLoading ? '...' : 'Хэрэглэх'}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-wider rounded hover:bg-black/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="size-5 animate-spin" /> : <><span>Төлбөр төлөх (QPay)</span><ChevronRight className="size-4" /></>}
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">Захиалах товчийг дарснаар QPay төлбөрийн цэс гарна.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
