'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, CreditCard, CheckCircle2, Smartphone, Loader2, XCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { QPayQrDisplay } from '@/app/components/QPayQrDisplay';
import { createOrder, getOrder, validatePromoCode, type CreateOrderResponse, type ValidatePromoResponse } from '@/app/lib/api';

const POLL_INTERVAL_MS = 3000;

interface DirectCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number | string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

export function DirectCheckoutModal({ isOpen, onClose, product }: DirectCheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'city' | 'countryside'>('city');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderResult, setOrderResult] = useState<CreateOrderResponse | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<ValidatePromoResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const productTotal = product.price * product.quantity;
  const deliveryFee = deliveryMethod === 'city' ? 10000 : 15000;
  const discountAmount = appliedPromo?.valid && appliedPromo.discount_amount ? appliedPromo.discount_amount : 0;
  const grandTotal = Math.max(0, productTotal + deliveryFee - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Нэрээ оруулна уу.');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Утасны дугаараа оруулна уу.');
      return;
    }
    setLoading(true);
    try {
      const res = await createOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress.trim() || undefined,
        items: [{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity,
        }],
        promo_code: appliedPromo?.valid && appliedPromo.code ? appliedPromo.code : undefined,
      });
      setOrderResult(res);
      setStep('payment');
      toast.success('Захиалга үүслээ. QPay-аар төлнө үү.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Захиалга үүсгэхэд алдаа гарлаа.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setStep('form');
    setOrderResult(null);
    setOrderStatus(null);
    setAppliedPromo(null);
    setPromoInput('');
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen || step !== 'payment' || !orderResult?.order_id) return;
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
        // ignore
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
  }, [isOpen, step, orderResult?.order_id, orderResult?.status]);

  const isPaid = orderStatus === 'paid';
  const title = step === 'form' ? 'Худалдан авалт' : (step === 'payment' && orderResult ? (isPaid ? 'Төлөгдлөө' : 'Төлбөр төлөх') : 'Баярлалаа');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[70] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-5 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold font-serif">{title}</h2>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="size-20 bg-white rounded-md overflow-hidden shrink-0 border border-gray-200">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                      <div className="text-xs text-gray-500 mb-2">Тоо ширхэг: {product.quantity}</div>
                      <div className="font-bold text-accent">{productTotal.toLocaleString()}₮</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Нэр *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Таны нэр"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="size-4 text-accent" />
                        Утасны дугаар *
                      </label>
                      <input
                        required
                        type="tel"
                        maxLength={8}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="88888888"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Хүргэлтийн нөхцөл</label>
                      <div className="grid grid-cols-1 gap-2">
                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${deliveryMethod === 'city' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="delivery" className="accent-accent" checked={deliveryMethod === 'city'} onChange={() => setDeliveryMethod('city')} />
                          <div className="flex-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Хүргүүлж авах</span>
                              <span className="font-bold text-accent">10,000₮</span>
                            </div>
                            <p className="text-xs text-gray-500">УБ хот дотор (A бүс)</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${deliveryMethod === 'countryside' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="delivery" className="accent-accent" checked={deliveryMethod === 'countryside'} onChange={() => setDeliveryMethod('countryside')} />
                          <div className="flex-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Орон нутгийн унаанд</span>
                              <span className="font-bold text-accent">15,000₮</span>
                            </div>
                            <p className="text-xs text-gray-500">Унаанд тавьж өгөх хөлс</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="size-4 text-accent" />
                        {deliveryMethod === 'city' ? 'Хүргэлтийн хаяг' : 'Унааны мэдээлэл'}
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        placeholder={deliveryMethod === 'city' ? 'Дүүрэг, хороо, байр, орц...' : 'Зогсоол, утас, машин...'}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Барааны үнэ:</span>
                      <span>{productTotal.toLocaleString()}₮</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Хүргэлт:</span>
                      <span>{deliveryFee.toLocaleString()}₮</span>
                    </div>
                    {appliedPromo?.valid && discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>Промо код ({appliedPromo.code})</span>
                        <span>-{discountAmount.toLocaleString()}₮</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2 pt-2 border-t border-dashed border-gray-200">
                      <span className="font-bold text-gray-900">Нийт төлөх:</span>
                      <span className="text-2xl font-bold text-accent">{grandTotal.toLocaleString()}₮</span>
                    </div>
                    {appliedPromo?.valid ? (
                      <div className="flex items-center justify-between gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200 mb-2">
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
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Промо код оруулах"
                          className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        />
                        <button
                          type="button"
                          disabled={promoLoading || !promoInput.trim()}
                          onClick={async () => {
                            const code = promoInput.trim();
                            if (!code) return;
                            setPromoLoading(true);
                            try {
                              const result = await validatePromoCode(code, productTotal);
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
                          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {promoLoading ? '...' : 'Хэрэглэх'}
                        </button>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-accent text-white font-bold uppercase tracking-wider rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="size-5 animate-spin" /> : <><CreditCard className="size-5" />Төлбөр төлөх (QPay)</>}
                    </button>
                    <p className="text-xs text-center text-gray-500">Захиалах товчийг дарснаар QPay төлбөрийн цэс гарна.</p>
                  </div>
                </form>
              ) : step === 'payment' && orderResult ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`size-12 rounded-full flex items-center justify-center ${isPaid ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {isPaid ? <CheckCircle2 className="size-6 text-green-600" /> : <XCircle className="size-6 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Захиалга #{orderResult.order_number}</h3>
                      <p className="text-sm text-gray-500">Нийт {orderResult.total.toLocaleString()}₮</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {isPaid ? 'Төлөгдлөө' : 'Төлбөр төлөгдөнгүй'}
                    </span>
                  </div>
                  {!isPaid && (
                    <>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 text-center">QR кодыг уншуулж төлнө үү</p>
                        <QPayQrDisplay qrImage={orderResult.qpay.qr_image} qrCode={orderResult.qpay.qr_code} size={200} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Банк / аппаа сонгоно уу:</p>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                          {orderResult.qpay.urls?.slice(0, 10).map((u, idx) => (
                            <a
                              key={idx}
                              href={u.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent/5 transition-colors"
                            >
                              {u.logo ? <img src={u.logo} alt={u.name} className="size-8 object-contain" /> : <Smartphone className="size-8 text-gray-400" />}
                              <span className="text-xs font-medium truncate">{u.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">Төлбөр төлсний дараа «Төлөгдлөө» гэж автоматаар шинэчлэгдэнэ.</p>
                    </>
                  )}
                  {isPaid && (
                    <p className="text-sm text-green-700 bg-green-50 rounded-lg p-4">Таны төлбөр амжилттай төлөгдлөө. Захиалга баталгаажлаа.</p>
                  )}
                  <button onClick={handleClose} className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition">
                    Хаах
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
