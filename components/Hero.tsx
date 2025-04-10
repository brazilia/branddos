export default function Hero() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Build stunning websites faster.
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            A modern no-code platform to launch your online presence without
            writing a single line of code.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="text-blue-600 border border-blue-600 px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-50 transition"
            >
              Watch Demo
            </a>
          </div>
        </div>

        <div className="mt-12 md:mt-0 w-full md:w-1/2">
          <img
            src="/screenshot.png"
            alt="App Screenshot"
            className="w-full rounded-xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
