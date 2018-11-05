'use strict';

const STORE = {
    list: [{ name: "apples", checked: false },
    { name: "oranges", checked: false },
    { name: "milk", checked: true },
    { name: "bread", checked: false }],
    hideChecked: false,
    search: null
};


function generateItemElement(item, itemIndex, template) {
    return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
    console.log("Generating shopping list element");

    const items = shoppingList.map((item, index) => generateItemElement(item, index));

    return items.join("");
}


function renderShoppingList() {
    // this function will be responsible for rendering the shopping list in
    // the DOM    
    let items = STORE.list;
    if (STORE.hideChecked) {
        items = STORE.list.filter(item => !item.checked);
    }
    if (STORE.search) {
        items = STORE.list.filter(item => STORE.search === item.name);
    }
    console.log('`renderShoppingList` ran');
    const shoppingListItemsString =
        generateShoppingItemsString(items);

    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
    console.log(STORE);
}


function addItemToShoppingList(itemName) {
    console.log(`Adding "${itemName}" to shopping list`);
    STORE.list.push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
        event.preventDefault();
        console.log('`handleNewItemSubmit` ran');
        const newItemName = $('.js-shopping-list-entry').val();
        $('.js-shopping-list-entry').val('');
        addItemToShoppingList(newItemName);
        renderShoppingList();
    });
}

function toggleCheckedForListItem(itemIndex) {
    console.log("Toggling checked property for item at index " + itemIndex);
    STORE.list[itemIndex].checked = !STORE.list[itemIndex].checked;
}


function getItemIndexFromElement(item) {
    const itemIndexString = $(item)
        .closest('.js-item-index-element')
        .attr('data-item-index');
    return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
        console.log('`handleItemCheckClicked` ran');
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        toggleCheckedForListItem(itemIndex);
        renderShoppingList();
    });
}
// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
    console.log(`Deleting item at index  ${itemIndex} from shopping list`)

    // as with `addItemToShoppingLIst`, this function also has the side effect of
    // mutating the global STORE value.
    //
    // we call `.splice` at the index of the list item we want to remove, with a length
    // of 1. this has the effect of removing the desired item, and shifting all of the
    // elements to the right of `itemIndex` (if any) over one place to the left, so we
    // don't have an empty space in our list.
    STORE.list.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
        // get the index of the item in STORE
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        console.log(itemIndex);
        // delete the item
        deleteListItem(itemIndex);
        // render the updated shopping list
        renderShoppingList();
    });
}
function toggleHideChecked() {
    STORE.hideChecked = !STORE.hideChecked;
}
function clickedHideHandle() {
    $('input[type="checkbox"]').change(function (event) {
        if ($(this).prop('checked') === true) {
            STORE.hideChecked = 1;
        }
        else {
            STORE.hideChecked = 0;
        }
        renderShoppingList();
    });
}
function search(input) {
    STORE.search = input;
}

function findSearch() {
    $('#search').submit(event => {
        event.preventDefault();
        const textString = $('.js-search').val();

        if (textString) {
            search(textString);
        }
        else {
            search(undefined);
        }
        renderShoppingList();
    });
}

function handleShoppingList() {
    renderShoppingList();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleNewItemSubmit();
    clickedHideHandle();
    findSearch();
}

$(handleShoppingList);