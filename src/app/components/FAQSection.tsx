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
            <div className="pb-4 pt-1 px-4 text-gray-600 leading-relaxed text-sm whitespace-pre-line">
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
      question: "Эрх / лиценз хэр удаан хугацаанд ирэх вэ?",
      answer: "Төлбөр баталгаажсаны дараа ихэнх лиценз/эрхийн мэдээллийг 5–30 минутын дотор илгээнэ. Зарим бүтээгдэхүүн (ж: Microsoft 365 багц, enterprise төрлийн эрх) нь шалгалт шаарддаг тул 1–6 цаг болох боломжтой. Ачааллаас хамаарч бага зэрэг хэлбэлзэж болно."
    },
    {
      question: "Лиценз яаж авах вэ? Алхамууд нь?",
      answer: "• Сайтаас бүтээгдэхүүнээ сонгоно\n• Захиалга үүсгээд төлбөрөө хийнэ\n• Төлбөр баталгаажмагц лиценз/аккаунтын мэдээлэл имэйл эсвэл чат-аар очно\n• Идэвхжүүлэх зааврыг дагаад ашиглана\n\nХэрэв суулгалт/идэвхжүүлэлт дээр асуудал гарвал бид алсаас зааж өгнө."
    },
    {
      question: "Баталгаат хугацаа, буцаалт (refund) байдаг уу?",
      answer: "Дижитал бүтээгдэхүүн тул илгээсний дараа буцаалт хийх боломж хязгаарлагдмал. Гэхдээ манай буруугаас (буруу key, ажиллахгүй эрх, идэвхжихгүй) бол солих / засаж өгөх / дахин илгээх байдлаар 100% шийднэ. (Баталгааны нөхцөл нь бүтээгдэхүүн бүрээс хамаарч өөр байна.)"
    },
    {
      question: "Ямар төлбөрийн хэлбэрүүдтэй вэ?",
      answer: "Бид QPay, банкны шилжүүлэг, мөн боломжтой тохиолдолд карт зэрэг хэлбэрээр төлбөр авна. Төлбөр хийсний дараа гүйлгээний утга/захиалгын дугаар-аа зөв бичихийг зөвлөе — ингэснээр автоматаар хурдан баталгаажна."
    },
    {
      question: "Идэвхжүүлэхэд туслах уу? Алсаас тохируулж өгдөг үү?",
      answer: "Тийм. Лиценз идэвхжүүлэх, нэвтрэх, суулгах үед асуудал гарвал бид чат/дуудлагаар зааварлана, шаардлагатай бол алсаас (AnyDesk/TeamViewer) холбогдож тусалж болно."
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
                        href="tel:76073333"
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
