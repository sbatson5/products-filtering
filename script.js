const ProductsStore = new ProductStore();

const TYPE_OPERATORS = {
  string: ['equals', 'any', 'none', 'in', 'contains'],
  number: ['equals', 'greater_than', 'less_than', 'any', 'none', 'in'],
  enumerated: ['equals', 'any', 'none', 'in']
};

// this becomes the one stateful piece in this code (aside from the store)
// this is only used because not all products have every field
// but I wanted the table rows to span the full width
// this could also be solved by _not_ using a table
let numberOfColumns;

// our initial setup, automatically invoked
(function() {
  createTableHeader();
  populateTable();
  createPropertySelect();
  createSecondaryInputs('string');

  document.querySelector('#apply-button').addEventListener('click', function() {
    filterProducts();
  });

  document.querySelector('#clear-button').addEventListener('click', function() {
    ProductsStore.resetProducts();
    clearTable();
    populateTable();
  });

  document.querySelector('#property-name').addEventListener('change', function(event) {
    let property = datastore.getProperties().find((property) => property.id == event.target.value);

    let { type, values } = property;
    createSecondaryInputs(type, values);
  });
})();

// create the additional inputs based on the first selection
function createSecondaryInputs(type, values) {
  createOperatorDropdown(type);
  createValueInput(type, values);
  observeOperator();
}

// Dynamically create the table headers based on the provided categories
function createTableHeader() {
  let propertyNames = datastore.getProperties().map((property) => {
    return property.name;
  });
  numberOfColumns = propertyNames.length;
  let tableElement = document.querySelector('#products-data-table');
  let headerRow = document.createElement('tr');
  headerRow.classList.add('header-row');
  propertyNames.forEach((propertyName) => {
    let columnHeader = document.createElement('th');
    columnHeader.textContent = propertyName;
    headerRow.appendChild(columnHeader);
  });

  tableElement.appendChild(headerRow);
}

function populateTable() {
  let products = ProductsStore.products;

  let tableElement = document.querySelector('#products-data-table');
  products.forEach((product) => {
    let productElement = createTableRow(product);
    tableElement.appendChild(productElement);
  });
}

function createTableRow(product) {
  if (!product) {
    return;
  }
  let tableRowElement = document.createElement('tr');
  tableRowElement.classList.add('product-item');

  let propertyValues = product.property_values;

  propertyValues.forEach((property, index) => {
    let tableDataElement = document.createElement('td');
    tableDataElement.textContent = property.value;

    // Since not all products have every property listed, we update
    // the colSpan of the last td element to ensure it fills the table
    if (index == propertyValues.length - 1) {
      let remainingColumnsToFill = numberOfColumns - propertyValues.length;
      if (remainingColumnsToFill > 0) {
        tableDataElement.colSpan = remainingColumnsToFill + 1;
      }
    }

    tableRowElement.appendChild(tableDataElement);
  });

  return tableRowElement;
}

function createPropertySelect() {
  let properties = datastore.getProperties();
  let wrapper = document.querySelector('#filter-selection-wrapper');
  let selectElement = document.createElement('select');
  selectElement.id = 'property-name';

  properties.forEach((property) => {
    _createOption(selectElement, property.id, property.name);
  });
  wrapper.appendChild(selectElement);
}

function filterProducts() {
  clearTable(false);
  let properties = datastore.getProperties();
  let selectedIndex = getSelectedField();

  let property = properties[selectedIndex];
  let operatorValue = document.querySelector('#operator-dropdown').value;
  let selectedValue = _getValueSelections();

  ProductsStore.applyFilter(property, operatorValue, selectedValue);
  populateTable();
}

function getSelectedField() {
  return document.querySelector('#property-name').value;
}

// resets the table and clears the last input
function clearTable(shouldClearInput = true) {
  let productRows = document.querySelectorAll('.product-item');
  productRows.forEach((row) => row.remove());
  if (shouldClearInput) {
    document.querySelector('#value-input').value = '';
  }
}

function createOperatorDropdown(type) {
  _deleteExistingElement('#operator-dropdown');
  let newOperatorSelect = document.createElement('select');
  newOperatorSelect.id = 'operator-dropdown';

  let operatorList = datastore.getOperators();

  // we use the defined const above to figure out which operators we want
  TYPE_OPERATORS[type].forEach((operator) => {
    let { text } = operatorList.find((operatorItem) => operatorItem.id === operator);
    _createOption(newOperatorSelect, operator, text);
  });
  document.querySelector('#filter-selection-wrapper').appendChild(newOperatorSelect);
}

function createValueInput(type, values) {
  _deleteExistingElement('#value-input');
  let newValueInput;

  if (type == 'enumerated' && values.length) {
    newValueInput = document.createElement('select');
    values.forEach((value) => {
      _createOption(newValueInput, value, value);
    });
  } else {
    newValueInput = document.createElement('input');
  }
  newValueInput.id = 'value-input';
  document.querySelector('#filter-selection-wrapper').appendChild(newValueInput);
}

// we have to observe this input as it controls whether the final input
// is a single or multi-select
function observeOperator() {
  document.querySelector('#operator-dropdown').addEventListener('change', function(event) {
    let selectValue = document.querySelector('select#value-input');
    if (!selectValue) {
      return;
    }
    if (event.target.value == 'equals') {
      document.querySelector('select#value-input').multiple = false;
    } else {
      document.querySelector('select#value-input').multiple = true;
    }
  });
}

// this logic was repeated throughout, so DRY'd up a bit here
function _createOption(parentElement, value, name) {
  let optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.textContent = name;
  parentElement.appendChild(optionElement);
}

function _getValueSelections() {
  let valueInput = document.querySelector('#value-input');
  if (valueInput.multiple) {
    // the `options` property returns HTMLOptionsCollection which is not
    // a normal JS Array and therefore does not inheret the `map` method
    // the final `filter` call simply strips away any `undefined` props
    return Array.from(valueInput.options)
      .map((option) => option.selected ? option.value : undefined)
      .filter((value) => value);
  } else {
    return valueInput.value;
  }
}

function _deleteExistingElement(selector) {
  let existingElement = document.querySelector(selector);
  if (existingElement) {
    existingElement.remove();
  }
}
