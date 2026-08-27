function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🎬 WatchNext</h1>
        
        <nav className="navbar">
          <div>WatchNext</div>
          <div>
            <a href="#">Lien 1</a>
            <a href="#">Lien 2</a>
          </div>
        </nav>
      </header>

      <section className="search-section">
        <input 
          type="text" 
          placeholder="Recherche..." 
          className="search-input"
        />
        <button className="search-button">Rechercher</button>
      </section>

      <section className="results-section">
        <div className="movie-card">
          <img src="" alt="Affiche du film" />
          <h3>Titre du film</h3>
        </div>
      </section>
    

    </div>
  )
}

export default App