class SearchEngine {
    constructor(apiUrl = 'https://api-adresse.data.gouv.fr/search/') {
        this.apiUrl = apiUrl;
    }

    async search(query) {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { //uselesss cause defer on html
    const searchEngine = new SearchEngine();
    const searchInput = document.getElementById('searchInput');
    const divResultats = document.getElementById('results');

    const tempo = (fonction, delai) => {
        let minuteur;
        return (...args) => {
            clearTimeout(minuteur);
            minuteur = setTimeout(() => fonction.apply(this, args), delai);
        };
    };

    const gererSaisie = async (evenement) => {
        const requete = evenement.target.value;
        if (requete.length >= 3) {
            const resultats = await searchEngine.search(requete);
            if (resultats && resultats.features) {
                const etiquettes = resultats.features.map(element => element.properties.label);
                divResultats.innerHTML = etiquettes.join('<br>');
            } else {
                divResultats.innerHTML = 'Aucun résultat trouvé.';
            }
        } else {
            divResultats.innerHTML = '';
        }
    };

    searchInput.addEventListener('input', tempo(gererSaisie, 300));
});
