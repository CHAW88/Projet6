// Gestion des appels à l'API :
export async function getWorks() {
    await fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(dataWorks => {
            // Affichez les données sous forme de tableau:
            console.table(dataWorks);
            // Sélection de la div qui va contenir les travaux:
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
  
            //On crée les travaux à partir des données récupérées via l'API
            dataWorks.forEach((work) => {
                // Création des éléments nécessaires à l'affichage des travaux 
                const card = document.createElement("figure");
                const imgCard = document.createElement("img");
                const titleCard = document.createElement("figcaption");
                // On récupère les données importantes pour afficher les travaux
                imgCard.src = work.imageUrl;
                imgCard.alt = work.title;
                titleCard.innerText = work.title;
                imgCard.dataset.category = work.categoryId;
                card.dataset.categoryId = work.categoryId;
                card.setAttribute('data-id', work.id); // Ajout d'un attribut data-id pour stocker l'ID de travail
                // On relie les éléments img et title à leur parent card
                card.appendChild(imgCard);
                card.appendChild(titleCard);
                // On relie la card à la balise div qui contient la galerie
                gallery.appendChild(card);
                console.log(work)
            });
        });
  };
  getWorks()

// Récupération des catégories 
// création des boutons filtres
const filterContainer = document.querySelector('.filter');

const button = document.createElement('button');
button.classList.add('bouton-css');
button.classList.add('selected');
button.setAttribute('autofocus', true);
button.innerText = 'Tous';
filterContainer.appendChild(button);

button.addEventListener('click', () => {

    //Afficher toutes les catégories d'œuvres//
    const elements = document.querySelectorAll('div.gallery figure');
    elements.forEach((element) => {
        element.style.display = 'block';
    });
})

async function getCategories() {
    await fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(dataCategories => {
            // Test de récupération des catégories
            console.table(dataCategories);

            dataCategories.forEach(category => {
                const button = document.createElement('button');
                button.classList.add('bouton-css');
                button.innerText = category.name;
                filterContainer.appendChild(button);

                button.addEventListener('click', () => {
                    const elements = document.querySelectorAll('div.gallery figure');
                    elements.forEach((element) => {
                        const categoryId = element.dataset.categoryId;
                        if (categoryId === `${category.id}`) {
                            element.style.display = 'block';
                        } else {
                            element.style.display = 'none';
                        }
                    });
                });
            });

            //Fonction qui maintient le bouton de filtre sélectionné//
            const boutons = document.querySelectorAll('.bouton-css');

            boutons.forEach((bouton) => {
                bouton.addEventListener('click', function () {
                    boutons.forEach((bouton) => {
                        bouton.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    sessionStorage.setItem('boutonSelectionne', this.id);
                });
            });

        });

};
getCategories()

//permet de revenir au "tout filtre" lors du rechargement de la page //
window.onbeforeunload = function () {
    sessionStorage.removeItem('boutonSelectionne');
}
