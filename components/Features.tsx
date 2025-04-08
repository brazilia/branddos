const features = [
  {
    emoji: "🧠",
    title: "Smart Captions",
    desc: "Trendy, on-brand captions in one click.",
  },
  {
    emoji: "🎨",
    title: "AI Visuals",
    desc: "Post-ready images without hiring a designer.",
  },
  {
    emoji: "📬",
    title: "DM Replies",
    desc: "Auto-respond to customers like a human.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-[#F9FBFC] px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 border border-[#213555]/10 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">{feature.emoji}</div>
            <h3 className="text-xl font-semibold text-[#213555] mb-2">{feature.title}</h3>
            <p className="text-[#3E5879]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
