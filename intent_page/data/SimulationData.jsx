import React, { useEffect, useState } from "react";

const SimulationData = () => {
  const [summary, setSummary] = useState("Loading latest summary...");
  const [summaryFile, setSummaryFile] = useState(null);

  useEffect(() => {
    const fetchLatestSummary = async () => {
      try {
        const res = await fetch("/summaries/");
        const text = await res.text();
        const parser = new DOMParser();
        const html = parser.parseFromString(text, "text/html");
        const files = Array.from(html.querySelectorAll("a"))
          .map(a => a.getAttribute("href"))
          .filter(name => name.endsWith(".txt"));
        const latest = files.sort().reverse()[0]; // pick most recent file
        if (latest) {
          setSummaryFile(latest);
          const summaryRes = await fetch(`/summaries/${latest}`);
          const summaryText = await summaryRes.text();
          setSummary(summaryText);
        }
      } catch (err) {
        console.error("Failed to load summary:", err);
        setSummary("Error loading summary.");
      }
    };

    fetchLatestSummary();
  }, []);

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Entropy & Complexity Over Time</h3>
        <img
          src="/charts/entropy_chart.png"
          alt="Entropy Chart"
          className="mx-auto rounded-xl shadow-lg max-w-full"
        />
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Latest Summary</h3>
        <div className="bg-gray-100 p-4 rounded-md shadow text-left max-w-2xl mx-auto whitespace-pre-wrap">
          {summary}
        </div>
        {summaryFile && (
          <p className="text-sm mt-2 text-gray-500">
            Source: <code>{summaryFile}</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default SimulationData;
