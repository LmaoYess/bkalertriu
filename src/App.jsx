import { useState, useRef, useEffect } from "react";
import "./App.css";
import logo from './logo.png'; // Import your logo file

export default function App() {
  const [searchYear, setSearchYear] = useState("");
  const [error, setError] = useState("");
  const yearRefs = useRef({});
  const [clickCount, setClickCount] = useState(() => {
    const savedCount = localStorage.getItem("bkAlertClickCount");
    return savedCount ? parseInt(savedCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem("bkAlertClickCount", clickCount.toString());
  }, [clickCount]);

  useEffect(() => {
    setClickCount(prev => prev + 1);
  }, []);

  const articles = [/* keep your articles array */];

  const articlesByYear = articles.reduce((acc, article) => {
    const year = article.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(article);
    return acc;
  }, {});

  const handleSearch = () => {
    if (yearRefs.current[searchYear]) {
      setError("");
      yearRefs.current[searchYear].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      setError("No articles found for this year");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="App">
      <header>
        <div className="click-counter">🔍 {clickCount.toLocaleString()}</div>
        <div className="header-content">
          <img src={logo} alt="BKAlert Logo" className="main-logo" />
          <h1>BKAlert Cybersecurity</h1>
          <div className="search-container">
            <input
              type="number"
              placeholder="Search by year"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              min="2000"
              max="2024"
            />
            <button onClick={handleSearch}>Go</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </header>

      <main>
        {Object.keys(articlesByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <section
              key={year}
              ref={(el) => (yearRefs.current[year] = el)}
              className="year-section"
            >
              <h2>{year}</h2>
              <div className="news-grid">
                {articlesByYear[year].map((article, index) => (
                  <article key={index} className="card">
                    <img src={article.image} alt={article.title} />
                    <div className="content">
                      <h3>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <p>{article.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}