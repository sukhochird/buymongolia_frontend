'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left gap-4 hover:bg-gray-50/50 transition-colors px-4 rounded-lg"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span className="shrink-0 text-accent">
          {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1 px-4 text-gray-600 leading-relaxed text-sm">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Хүргэлт хэр удаан үргэлжлэх вэ?",
      answer: "Захиалга баталгаажсанаас хойш Улаанбаатар хот дотор 2-4 цагийн дотор хүргэгдэнэ. Баярын өдрүүдэд ачааллаас хамааран цаг өөрчлөгдөх боломжтой."
    },
    {
      question: "Цаг товлож захиалга өгч болох уу?",
      answer: "Болно. Та захиалга өгөхдөө хүссэн өдөр, цагаа сонгон тэмдэглэл хэсэгт бичих боломжтой. Бид таны заасан цагт хүргэж өгөх болно."
    },
    {
      question: "Хөдөө орон нутаг руу хүргэлт хийдэг үү?",
      answer: "Тийм. Бид хөдөө орон нутгийн унаанд найдвартай сав баглаа боодолтойгоор тавьж өгнө. Унааны төлбөр болон хүргэлтийн нөхцөлүүдийг захиалгын үед тохиролцоно."
    },
    {
      question: "Төлбөрийн ямар хэлбэрүүд байгаа вэ?",
      answer: "Та QPay, SocialPay, бүх банкны карт болон дансаар шилжүүлэх боломжтой. Мөн дэлгүүр дээр бэлнээр төлж болно."
    },
    {
      question: "Цэцэгээ хэрхэн удаан хадгалах вэ?",
      answer: "Цэцгийг нарны шууд тусгалаас хол, сэрүүн газар байрлуулна. Өдөр бүр усыг нь сольж, ишний үзүүрээс 1-2 см ташуу тайрах нь насжилтыг уртасгадаг."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Content */}
            <div className="lg:col-span-5">
                <div className="sticky top-24">
                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-accent/10 text-accent mb-6">
                        <HelpCircle className="size-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Түгээмэл асуулт хариулт</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Таны сонирхсон асуултад хариулахад бид бэлэн байна. Хэрэв танд нэмэлт мэдээлэл хэрэгтэй бол бидэнтэй холбогдоорой.
                    </p>
                    <a 
                        href="tel:77110000"
                        className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-black/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Бидэнтэй холбогдох
                    </a>
                </div>
            </div>

            {/* Right Accordion */}
            <div className="lg:col-span-7">
                <div className="bg-gray-50 rounded-2xl p-2 md:p-6 border border-gray-100 shadow-sm">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
