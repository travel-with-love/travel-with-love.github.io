import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js';
import { getFirestore, doc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAhvE0ap8qYEJCJ8SdKqMujYZqNxOP8T80",
    authDomain: "travel-with-love.firebaseapp.com",
    projectId: "travel-with-love",
    storageBucket: "travel-with-love.appspot.com",
    messagingSenderId: "847927457891",
    appId: "1:847927457891:web:1ec1221a6e2b023733e056"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const locationCollection = collection(db, "locations");
let locationArr = [];
async function addLocation(el) {
    await addDoc(locationCollection, {
        el
    })
        .then(
            () => {
                alert("Location added successfully");
            }
        )
        .catch(
            (error) => {
                alert("Location added failed" + error);
            }
        );
}

async function getLocations() {

    await getDocs(locationCollection).then(res => {
        console.log(res);
        res.forEach(doc => {
            locationArr.push(
                {
                    id: doc.id,
                    ...
                    doc.data().el
                });
        });
        loadLocationDetailsWithFirebase();        
    }).catch(error => alert("Failed to retrieve data" + error));

}

let INDEXES = 0;
await getLocations();
// loadXMLDoc();
function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadLocationDetailsWithXML(this);
        }
    };
    xmlhttp.open("GET", "locations.xml", true);
    xmlhttp.send();
}

function loadLocationDetailsWithXML(xml) {
    let xmlDoc = xml.responseXML;
    let locations = xmlDoc.getElementsByTagName("location");
    let locationsNode = document.getElementById("locations");
    INDEXES = locations.length;
    for (let i = 0; i < locations.length; i++) {
        let el = {
            position: i
        };
        let title = locations[i].getElementsByTagName("title")[0].innerHTML;
        let image = locations[i].getElementsByTagName("image")[0].innerHTML;
        if (title == "") {
            continue;
        }
        image = decodeURIComponent(image);
        el.title = title;
        el.image = image;
        let locationNode = document.createElement("div");
        locationNode.classList.add("col")
        locationNode.id = `index${i}`;
        let cardNode = document.createElement("div");
        cardNode.classList.add("card");
        locationNode.appendChild(cardNode);
        let imageNode = document.createElement("img");
        imageNode.classList.add("card-img-top");
        imageNode.setAttribute("src", image);
        cardNode.appendChild(imageNode);
        let cardBodyNode1 = document.createElement("div");
        cardBodyNode1.classList.add("card-body");
        cardNode.appendChild(cardBodyNode1);
        let titleNode = document.createElement("h5");
        titleNode.innerText = title;
        cardBodyNode1.appendChild(titleNode);

        let descriptions = locations[i].getElementsByTagName("description");
        let descArr = [];
        for (let j = 0; j < descriptions.length; j++) {
            let descriptionNode = document.createElement("p");
            descriptionNode.classList.add("card-text");
            descriptionNode.classList.add(`index${i}`);
            descriptionNode.innerHTML = descriptions[j].innerHTML;
            descArr.push(descriptions[j].innerHTML);
            cardBodyNode1.appendChild(descriptionNode);

        }
        el.description = descArr;

        let isVisited = locations[i].getElementsByTagName("isVisited")[0].innerHTML;
        let cardBodyNode2 = document.createElement("div");
        cardBodyNode2.classList.add("card-body");
        let unOrderList = document.createElement("ul");
        unOrderList.classList.add("list-group");
        unOrderList.classList.add("list-group-flush");
        let isVisitedNode = document.createElement("li");
        isVisitedNode.classList.add("list-group-item");
        isVisitedNode.innerHTML = `Visited: ${isVisited}`;
        unOrderList.appendChild(isVisitedNode);
        el.isVisited = isVisited;

        let links = locations[i].getElementsByTagName("link");
        let locArr = [];
        for (let k = 0; k < links.length; k++) {
            let linkNode = document.createElement("li");
            linkNode.classList.add("list-group-item");
            let anchorLinkNode = document.createElement("a");
            anchorLinkNode.setAttribute("target", "_blank");
            anchorLinkNode.setAttribute("href", links[k].getElementsByTagName("url")[0].innerHTML);
            anchorLinkNode.innerHTML = links[k].getElementsByTagName("name")[0].innerHTML;
            locArr.push({name: links[k].getElementsByTagName("name")[0].innerHTML, link: links[k].getElementsByTagName("url")[0].innerHTML});
            linkNode.appendChild(anchorLinkNode);
            unOrderList.appendChild(linkNode);

        }
        el.links = locArr;
        // addLocation(el);

        cardBodyNode2.appendChild(unOrderList);
        cardNode.appendChild(cardBodyNode2);

        locationsNode.appendChild(locationNode);
    }
    handleVisibilityOption();
}

function loadLocationDetailsWithFirebase() {
    let locationsNode = document.getElementById("locations");
    INDEXES = locationArr.length;
    for (let i = 0; i < locationArr.length; i++) {
        let title = locationArr[i].title;
        let image = locationArr[i].image;
        if (title == "") {
            continue;
        }
        let locationNode = document.createElement("div");
        locationNode.classList.add("col")
        locationNode.id = `index${i}`;
        let cardNode = document.createElement("div");
        cardNode.classList.add("card");
        locationNode.appendChild(cardNode);
        let imageNode = document.createElement("img");
        imageNode.classList.add("card-img-top");
        imageNode.setAttribute("src", image);
        cardNode.appendChild(imageNode);
        let cardBodyNode1 = document.createElement("div");
        cardBodyNode1.classList.add("card-body");
        cardNode.appendChild(cardBodyNode1);
        let titleNode = document.createElement("h5");
        titleNode.innerText = title;
        cardBodyNode1.appendChild(titleNode);

        let descriptions = locationArr[i].description;
        for (let j = 0; j < descriptions.length; j++) {
            let descriptionNode = document.createElement("p");
            descriptionNode.classList.add("card-text");
            descriptionNode.classList.add(`index${i}`);
            descriptionNode.innerHTML = descriptions[j];
            cardBodyNode1.appendChild(descriptionNode);

        }

        let isVisited = locationArr[i].isVisited;
        let cardBodyNode2 = document.createElement("div");
        cardBodyNode2.classList.add("card-body");
        let unOrderList = document.createElement("ul");
        unOrderList.classList.add("list-group");
        unOrderList.classList.add("list-group-flush");
        let isVisitedNode = document.createElement("li");
        isVisitedNode.classList.add("list-group-item");
        isVisitedNode.innerHTML = `Visited: ${isVisited}`;
        unOrderList.appendChild(isVisitedNode);

        let links = locationArr[i].links;
        for (let k = 0; k < links.length; k++) {
            let linkNode = document.createElement("li");
            linkNode.classList.add("list-group-item");
            let anchorLinkNode = document.createElement("a");
            anchorLinkNode.setAttribute("target", "_blank");
            anchorLinkNode.setAttribute("href", links[k].link);
            anchorLinkNode.innerHTML = links[k].name;
            linkNode.appendChild(anchorLinkNode);
            unOrderList.appendChild(linkNode);

        }

        cardBodyNode2.appendChild(unOrderList);
        cardNode.appendChild(cardBodyNode2);

        locationsNode.appendChild(locationNode);
    }
    handleVisibilityOption();
}

function handleVisibilityOption() {
    for (let i = 0; i < INDEXES - 1; i++) {
        let indexArea = document.getElementById(`index${i}`);
        indexArea.addEventListener("click", async (ev) => {
            let indexContents = document.getElementsByClassName(`index${i}`);
            for (let indexContent of indexContents) {
                indexContent.classList.contains("d-none") ? indexContent.classList.remove("d-none") : indexContent.classList.add("d-none");
            }
        });
    }
}