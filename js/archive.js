/**
 * This class dynamically constructs a DOM section containing hyperlinks to the original index cards.
 * The DOM section is injected into the container for the index cards and feed to lightgallery for display
 * When the gallery is closed, the DOM section is destroyed.
 * 
 */
class IndexCard {
    constructor(name, array) {
        this.name = name;
        this.array = array;
    }

    source() {
        return this.name;
    }

    elements() {
        return this.array;
    }
}

let indexCards = new Map();

/* Map the cards to their collections in archive/ folder */

/* card -> { directory } -> { files: format = directory name + sequencenumber, separator dash } */
//indexCards.set( 'assets/card1.jpg', new IndexCard( "1354909", ["-1" ]) );


/*

// Metadata filter by dataset above

printIndexCards();


function printIndexCard(value,key,map) {
    let id = `${value.name}`;
    console.log(JSON.stringify(findMetadata(id),null, 4));
}

function printIndexCards() {
    indexCards.forEach(printIndexCard);
}
*/

function createLink(id, array) {
    var item = "";
    for(  var i = 0; i < array.length; i ++ ) {

        var seq = array[i];

        name = "archive/" + id + "/" + id + seq + ".jpg";

        item += "<a " + (i == 0 ? "id=\"first-index-card\"" : "" )  +  " href=\"" + name + "\"><img src=\""+ name + "\"></a>\n";
    }

    return item;
}

function createGallery(name,array)
{
    document.getElementById("lightgallery").innerHTML = createLink(name,array );
    lightGallery(document.getElementById('lightgallery'));      
}

function displayIndexCards(key) {
    let ic = indexCards.get(key);
    if( ic === undefined)
        return false;
    createGallery(ic.source(), ic.elements());
    document.getElementById("first-index-card").click();
    return true;
}

function createPlainTextNode(text,parent)
{
    let elem = document.createElement("p");
    elem.setAttribute("class", "metadata");
    elem.setAttribute("translate", "yes");
    elem.innerText = text;
    parent.append(elem);
}

function createPlainText(metadataObject, parent)
{
    let text = "";
   
    if(metadataObject.DESCRIPTION !== undefined && metadataObject.AUTHOR !== undefined && metadataObject.MATERIALS !== undefined && metadataObject.DIMENSIONS !== undefined) {
        text = metadataObject.DESCRIPTION;
        text += " (";
        text += metadataObject.AUTHOR;
        text += " )";

        createPlainTextNode(text,parent);        

        text = metadataObject.MATERIALS;

        createPlainTextNode(text,parent);

        text = metadataObject.DIMENSIONS;

        createPlainTextNode(text,parent);
    }
    else if(metadataObject.DESCRIPTION !== undefined && metadataObject.AUTHOR !== undefined && metadataObject.MATERIALS !== undefined) {
        text = metadataObject.DESCRIPTION;
        text += " (";
        text += metadataObject.AUTHOR;
        text += " )";

        createPlainTextNode(text,parent);        

        text = metadataObject.MATERIALS;

        createPlainTextNode(text,parent);
    }
    else if(metadataObject.DESCRIPTION !== undefined && metadataObject.AUTHOR !== undefined) {
        text = metadataObject.DESCRIPTION;
        text += " (";
        text += metadataObject.AUTHOR;
        text += " )";

        createPlainTextNode(text,parent);
    }
    else if( metadataObject.DESCRIPTION !== undefined ) {
        text = metadataObject.DESCRIPTION;

        createPlainTextNode(text,parent);
    }
    else if ( metadataObject.AUTHOR !== undefined ) {
        text = metadataObject.AUTHOR;

        createPlainTextNode(text,parent);
    }
}

function findMetadata(key)
{
    /*
     If you decide to load the arts.js ,photography.js and texts.js metadata files, uncomment the following loops:
     */
    /* for( let x = 0; x < metadataArt.length; x++ ) {
        if( metadataArt[x].INVENTORY.includes(key) ) {
            return metadataArt[x];
        }
        
    }

    for( let x = 0; x < metadataPhotography.length; x++ ) {
        if( metadataPhotography[x].INVENTORY.includes(key)) {
            return metadataPhotography[x];
        }
        
    }

    for( let x = 0; x < metadataTexts.length; x++ ) {
        if( metadataTexts[x].INVENTORY.includes(key)) {
            return metadataTexts[x];
        }
    } */

    if(key === undefined )
        return null;

    for( let x = 0; x < metadataInformation.length; x ++ ) {
        if( metadataInformation[x].INVENTORY.includes(key)) {
            return metadataInformation[x];
        }
    }

    return null;
}

function clearMetadata() {
    console.log("Clear metadata");
    let elem = document.getElementById("metadata-container");
    while(elem.hasChildNodes()) {
        elem.removeChild(elem.firstChild);
    }
}

function createMetadataElement(key)
{
    let ic = indexCards.get(key);
    if( ic === undefined ) {
        console.log("No metadata entered for " + key);
        return;
    }

    clearMetadata();
    let metadata = findMetadata(ic.source());
    let parent = document.getElementById("metadata-container");
    if(metadata != null) {
        createPlainText(metadata,parent);
        console.log(metadata);
    }
    else {
        console.log("There is no metadata about object " + key);
    }

    createPlainTextNode("Double-click the card to see the original",parent);
}
