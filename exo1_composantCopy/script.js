function CopyComponent(id) {
    var text = document.getElementById(id).innerText;

    navigator.clipboard.writeText(text).then(function() {
        alert("Texte copié");
    }).catch(function(err) {
        console.error('Erreur lors de la copie du texte: ', err);
    });
}