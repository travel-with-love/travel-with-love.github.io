import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js';
import { getFirestore, doc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js';

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

let INDEXES = 0;
let locationArr = [];
loadUI();
await getLocations();
// loadXMLDoc();

function loadUI() {
    let addLocationBtn = document.getElementById("addLocationButton");
    let saveLocationBtn = document.getElementById("saveLocationBtn");
    let moreDescriptionBtn = document.getElementById("addLocDescriptionMoreBtn");
    let moreLinkBtn = document.getElementById("addLocLinkMore");
    var addModal = new bootstrap.Modal(document.getElementById('addModal'), {
        keyboard: false
    });
    addLocationBtn.addEventListener("click", (ev) => {
        addModal.show();
    });
    moreDescriptionBtn.addEventListener("click", (ev) => {
        let descriptionStack = document.getElementById("addLocDescriptionStack");
        let rowNode = document.createElement("div");
        rowNode.classList.add("row");
        rowNode.classList.add("mb-1");
        let colNode = document.createElement("div");
        colNode.classList.add("col");
        let descNode = document.createElement("input");
        descNode.classList.add("form-control");
        descNode.name = "addLocDescription";
        colNode.appendChild(descNode);
        rowNode.appendChild(colNode);
        descriptionStack.appendChild(rowNode);
    });
    moreLinkBtn.addEventListener("click", (ev) => {
        let linkStack = document.getElementById("addLocLinkStack");
        let rowNode1 = document.createElement("div");
        rowNode1.classList.add("row");
        rowNode1.classList.add("mb-1");
        let colNode11 = document.createElement("div");
        colNode11.classList.add("col-3");
        let labelNode1 = document.createElement("label");
        labelNode1.innerText = "Name";
        let colNode12 = document.createElement("div");
        colNode12.classList.add("col-9");
        let inputNode1 = document.createElement("input");
        inputNode1.classList.add("form-control");
        inputNode1.name = "addLocLinkName";
        colNode11.appendChild(labelNode1);
        colNode12.appendChild(inputNode1);
        rowNode1.appendChild(colNode11);
        rowNode1.appendChild(colNode12);
        linkStack.appendChild(rowNode1);

        let rowNode2 = document.createElement("div");
        rowNode2.classList.add("row");
        rowNode2.classList.add("mb-1");
        let colNode21 = document.createElement("div");
        colNode21.classList.add("col-3");
        let labelNode2 = document.createElement("label");
        labelNode2.innerText = "Link";
        let colNode22 = document.createElement("div");
        colNode22.classList.add("col-9");
        let inputNode2 = document.createElement("input");
        inputNode2.classList.add("form-control");
        inputNode2.name = "addLocLinkURL";
        colNode21.appendChild(labelNode2);
        colNode22.appendChild(inputNode2);
        rowNode2.appendChild(colNode21);
        rowNode2.appendChild(colNode22);
        linkStack.appendChild(rowNode2);
    });
    saveLocationBtn.addEventListener("click", async (ev) => {
        let title = document.getElementById("addLocTitle");
        let image = document.getElementById("addLocImage");
        let isVisited = document.getElementById("addLocIsVisited");
        let descriptionNodes = document.getElementsByName("addLocDescription");
        let linkNameNodes = document.getElementsByName("addLocLinkName");
        let linkURLNodes = document.getElementsByName("addLocLinkURL");

        if (title.value == "") {
            alert("Title can not be empty");
            return;
        }
        if (isVisited.value == "") {
            isVisited.value = "No";
        }
        let descriptions = [];
        for (let i = 0; i < descriptionNodes.length; i++) {
            if (descriptionNodes[i].value != "") {
                descriptions.push(descriptionNodes[i].value);
            }
        }

        let links = [];
        for (let i = 0; i < linkNameNodes.length; i++) {
            if (linkNameNodes[i].value != "" && linkURLNodes[i].value != "") {
                links.push({
                    name: linkNameNodes[i].value,
                    link: linkURLNodes[i].value
                });
            }
        }

        let el = {
            position: INDEXES,
            title: title.value,
            image: image.value,
            isVisited: isVisited.value,
            description: descriptions,
            links: links
        }
        await addDoc(locationCollection, {
            el
        })
            .then(
                () => {
                    alert("Location added successfully");
                    addModal.hide();
                    location.reload();
                }
            )
            .catch(
                (error) => {
                    alert("Location added failed" + error);
                }
            );
    });
}

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
    await getDocs(query(locationCollection, orderBy("el.position", "desc"))).then(res => {
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
            locArr.push({ name: links[k].getElementsByTagName("name")[0].innerHTML, link: links[k].getElementsByTagName("url")[0].innerHTML });
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
        indexArea.addEventListener("click", (ev) => {
            let indexContents = document.getElementsByClassName(`index${i}`);
            for (let indexContent of indexContents) {
                indexContent.classList.contains("d-none") ? indexContent.classList.remove("d-none") : indexContent.classList.add("d-none");
            }
        });
    }
}