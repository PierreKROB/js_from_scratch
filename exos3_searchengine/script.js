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
    const divResults = document.getElementById('results');

    const tempo = (fonction, delay) => {
        let minuteur;
        return (...args) => {
            clearTimeout(minuteur);
            minuteur = setTimeout(() => fonction.apply(this, args), delay);
        };
    };

    const handleInput = async (evenement) => {
        const request = evenement.target.value;
        if (request.length >= 3) {
            const resultats = await searchEngine.search(request);
            if (resultats && resultats.features) {
                const answer = resultats.features.map(element => element.properties.label);
                divResults.innerHTML = answer.join('<br>');
            } else {
                divResults.innerHTML = 'Aucun résultat trouvé.';
            }
        } else {
            divResults.innerHTML = '';
        }
    };

    searchInput.addEventListener('input', tempo(handleInput, 300));
});
