import { motion } from "motion/react";

export function IntroSection() {
  return (
    <section className="bg-white pt-2 pb-6 md:pt-4 md:pb-8 relative z-5">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--foreground)_20%,var(--accent)_50%,var(--foreground)_80%)] bg-[length:200%_auto] mb-4 md:mb-6"
            animate={{ backgroundPosition: ["0% center", "-200% center"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Elite Flower - Танд аз жаргал бэлэглэнэ
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed md:leading-loose">
            Бид таны хамгийн нандин мөчүүдийг гэрэлтүүлэх,
            сэтгэлийн үгээ цэцгээр дамжуулахад тань туслах
            болно. Дэлхийн өнцөг булан бүрээс шилэгдмэл, хамгийн
            шинэлэг цэцгүүдийг мэргэжлийн флористууд урлаж, таны
            хүссэн газарт түргэн шуурхай, найдвартай хүргэж
            үйлчилж байна.
          </p>
        </motion.div>
      </div>
    </section>
  );
}