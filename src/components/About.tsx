// src/components/About.tsx
import { useEffect, useState } from "react";

const About = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100); // small delay to trigger fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 px-6">
      <div
        className={`max-w-5xl mx-auto text-center transition-opacity duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About <span className="text-green-600">Mini-Storefront</span>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Mini-Storefront is your one-stop online destination for the latest
          fashion, timeless classics, and everyday essentials. Our mission is
          simple — to bring you high-quality clothing and lifestyle products at
          prices that make sense, with a seamless shopping experience that feels
          personal and effortless.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "Curated Collections",
              desc: "Handpicked styles designed to suit every mood, trend, and occasion.",
              icon: "🛍️",
            },
            {
              title: "Affordable Quality",
              desc: "We balance quality and price, so you never have to compromise.",
              icon: "💎",
            },
            {
              title: "Seamless Shopping",
              desc: "Fast, simple, and secure checkout — because your time matters.",
              icon: "⚡",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
