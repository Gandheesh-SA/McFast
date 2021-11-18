function makeList() {
    // Establish the array which acts as a data source for the list
    let listData = [
        'Blue',
        'Red',
        'White',
        'Green',
        'Black',
        'Orange'
    ],
    // Make a container element for the list
    var listContainer = document.createElement('div'),
    // Make the list
    var listElement = document.createElement('ul'),
    // Set up a loop that goes through the items in listItems one at a time
    var numberOfListItems = listData.length,
    var listItem,
    var i;

    // Add it to the page
    document.getElementsByTagName('body')[0].appendChild(listContainer);
    listContainer.appendChild(listElement);

    for (i = 0; i < numberOfListItems; ++i) {
        // create an item for each one
        listItem = document.createElement('li');

        // Add the item text
        listItem.innerHTML = listData[i];

        // Add listItem to the listElement
        listElement.appendChild(listItem);
    }
}


// Usage
makeList()