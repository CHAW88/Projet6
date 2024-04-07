/**MODALE**/
import { getWorks } from "./api";



const modal = document.querySelector('#modal')
const modalContent = document.querySelector('#modal-content');
const modalPhoto = document.querySelector('#modal-photo');
const modalClose = document.querySelector('#modal-close');

function showModal() {
  modal.style.display = 'block';
}

function hideModal() {
  modal.style.display = 'none';
}

modalContent.addEventListener('click', function (e) {
  e.stopPropagation();
});
modalPhoto.addEventListener('click', function (e) {
  e.stopPropagation();
});


modalClose.addEventListener('click', hideModal);
modal.addEventListener('click', hideModal);

document.getElementById("btnModifier").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-content").style.display = "block";
  document.getElementById("modal-photo").style.display = "none";

});
document.getElementById("modal-close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});


document.getElementById("modal-return").addEventListener("click", function () {
  document.getElementById("modal-photo").style.display = "none";
  document.getElementById("modal-content").style.display = "block";
});

/**Bouton Ajouter une photo**/

const newPhotoBtn = document.querySelector('#new-photo');
const returnBtn = document.querySelector('#modal-return');
const modalPhotoClose = document.querySelector("#modal-photo-close");


newPhotoBtn.addEventListener('click', function () {
  modalContent.style.display = 'none';
  modalPhoto.style.display = 'block';
});

returnBtn.addEventListener('click', function () {
  modalContent.style.display = 'flex';
  modalPhoto.style.display = 'none';
})

modalPhotoClose.addEventListener('click', hideModal);


/**AJOUTER DES TRAVAUX AU MODALE**/

const imagesModalContainer = document.querySelector('.gallery-modal')
function createModalWorkFigure(work) {
  const figure = document.createElement('figure')
  const figureCaption = document.createElement('figcaption')
  const figureImage = document.createElement('img')
  const deleteIcon = document.createElement('i')

  figureImage.src = work.imageUrl
  figureImage.alt = work.title
  figure.setAttribute('data-id', work.id); // Ajout d'un attribut data-id pour stocker l'ID de travail
  deleteIcon.className = "fa-regular fa-trash-can"
  figure.appendChild(figureImage)
  figure.appendChild(figureCaption)
  figure.appendChild(deleteIcon)

  // Ajout d'un événement de suppression en cliquant sur l'icône "supprimer"
  deleteIcon.addEventListener('click', (event) => {
    event.preventDefault();
    deleteWorkById(work.id);
  });

  return figure;

}

fetch('http://localhost:5678/api/works')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((work) => {
      const figure = createModalWorkFigure(work);
      imagesModalContainer.appendChild(figure);
    });
  });

/**SUPPRIMER LE TRAVAIL**/

function deleteWorkById(workId) {
  const token = localStorage.getItem("token");
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");

  if (!confirmation) return;

  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      "Accept": 'application/json',
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.ok) {
        // Suppression de l'élément dans la Galerie modale et on fait appel a la Fonction getWorks:
        const modalWorkToRemove = document.querySelector(`.gallery-modal figure[data-id="${workId}"]`);
        modalWorkToRemove.remove();
       getWorks();
        alert("Le travail a été supprimé  avec succès !");
      } else if (!response.ok) {
        throw new Error('La suppression du travail a échoué.');
      }
    
    });
};

//Vérifier le formulaire rempli et modification de la couleur du bouton de soumission//

const titleInput = document.getElementById('modal-photo-title');
const categorySelect = document.getElementById('modal-photo-category');
const imageInput = document.getElementById('image');
const submitButton = document.getElementById('modal-valider');

function checkForm() {
  if (titleInput.value !== '' && categorySelect.value !== '' && imageInput.value !== '') {
    submitButton.style.backgroundColor = '#1D6154';
  } else {
    submitButton.style.backgroundColor = '';
  }
}

titleInput.addEventListener('input', checkForm);
categorySelect.addEventListener('change', checkForm);
imageInput.addEventListener('change', checkForm);


/**AJOUTER UN NOUVEAU TRAVAIL**/

const btnValider = document.getElementById("modal-valider");
btnValider.addEventListener("click", addNewWork);

function addNewWork(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const title = document.getElementById("modal-photo-title").value;
  const category = document.getElementById("modal-photo-category").value;
  const image = document.getElementById("image").files[0];


  if (!title || !category || !image) {
    alert('Veuillez remplir tous les champs du formulaire.')
    return;
  }

  //vérifie si l'image ne dépasse pas 4mo//
  if (image.size > 4 * 1024 * 1024) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": 'application/json',
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(work => {

      //créer et ajouter la nouvelle œuvre à la galerie//
      const gallery = document.querySelector(".gallery");
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
      //créer et ajouter la nouvelle œuvre à la galerie modale//
      const figureModal = createModalWorkFigure(work);
      const galleryModal = document.querySelector('.gallery-modal');
      galleryModal.appendChild(figureModal);
      document.getElementById("modal-photo").style.display = "none";
      document.getElementById("modal-content").style.display = "block";
      // Réinitialiser les champs de saisie de la modale
      document.getElementById("modal-photo-title").value = "";
      document.getElementById("modal-photo-category").value = "";
      document.getElementById("iModalImage").style.display = "block";
      document.getElementById("label-image").style.display = "flex";
      document.getElementById("iModalFormat").style.display = "block";
       const imageRemoved = document.querySelector('#form-photo-div img');
      const formPhotoDiv = document.getElementById('form-photo-div');
      formPhotoDiv.removeChild(imageRemoved);

      checkForm();
      alert('Le nouvel travail a été ajouté avec succès.');
    })

    .catch(error => console.error(error));
}

/**APERÇU IMG**/
const inputImage = document.getElementById("image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector("#form-photo-div > p");
const iconeImage = document.querySelector("#iModalImage");

inputImage.addEventListener("change", function () {
  const selectedImage = inputImage.files[0];

  const imgPreview = document.createElement("img");
  imgPreview.src = URL.createObjectURL(selectedImage);
  imgPreview.style.maxHeight = "100%";
  imgPreview.style.width = "auto";

  labelImage.style.display = "none";
  pImage.style.display = "none";
  inputImage.style.display = "none";
  iModalImage.style.display = "none";
  document.getElementById("form-photo-div").appendChild(imgPreview);
});

/**Catégories modale**/

const selectCategory = document.getElementById('modal-photo-category');

const reponseCategory = fetch('http://localhost:5678/api/categories')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((category) => {
      const categoryOption = document.createElement('option')
      const categoryLabel = document.createElement('label')

      categoryOption.setAttribute('value', category.id)
      categoryLabel.innerHTML = category.name

      selectCategory.appendChild(categoryOption)
      categoryOption.appendChild(categoryLabel)
    });
  });

