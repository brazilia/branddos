export default function Hero() {
  return (
    <section className="text-center py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-4xl md:text-6xl font-bold text-[#213555] mb-6">
        Let AI Run Your Socials
      </h1>
      <p className="text-lg md:text-xl text-[#3E5879] max-w-2xl mx-auto mb-8">
        Generate captions, visuals, and replies in seconds. Social media, the way it should be.
      </p>
      <a
        href="/signup"
        className="inline-block px-6 py-3 text-white bg-[#213555] rounded-lg text-lg hover:bg-[#1A2B45] transition"
      >
        Start Free Trial
      </a>
    </section>
  );
}
