import React from "react";

function App() {
  const pages = [
    { name: "Analysis", link: "/analysis", emoji: "📊" },
    { name: "Framework", link: "/framework", emoji: "🚀" },
    { name: "Media", link: "/media", emoji: "🎧" },
    { name: "Run Locally", link: "/run", emoji: "🧪" },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-bold mb-8 text-center">
        🌌 Welcome to IntentSim
      </h1>
      <p className="text-lg text-center mb-12 max-w-xl">
        A living simulation of an intent-driven proto-universe. Choose your
        destination:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {pages.map((page) => (
          <a
            key={page.name}
            href={page.link}
            className="bg-gray-100 hover:bg-gray-200 transition rounded-2xl p-6 shadow-md text-center text-xl font-semibold flex flex-col items-center"
          >
            <span className="text-4xl mb-2">{page.emoji}</span>
            {page.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;

