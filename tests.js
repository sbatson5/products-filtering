function triggerEvent(domElement, eventName) {
  if (!eventName) {
    return;
  }
  let changeEvent = new Event(eventName);
  domElement.dispatchEvent(changeEvent);
}

function selectProductName() {
  let propertyDropdown = document.querySelector('#property-name');
  propertyDropdown.selectedIndex = 0; // change to 'product name'
  triggerEvent(propertyDropdown, 'change');
}

function selectWeight() {
  let propertyDropdown = document.querySelector('#property-name');
  propertyDropdown.selectedIndex = 2; // change to 'weight'
  triggerEvent(propertyDropdown, 'change');
}

function selectCategory() {
  let propertyDropdown = document.querySelector('#property-name');
  propertyDropdown.selectedIndex = 3; // change to 'category'
  triggerEvent(propertyDropdown, 'change');
}

function apply() {
  let applyButton = document.querySelector('#apply-button');
  triggerEvent(applyButton, 'click');
}

function clear() {
  let applyButton = document.querySelector('#clear-button');
  triggerEvent(applyButton, 'click');
}

QUnit.module('filter inputs');
QUnit.test('it populates column labels', function(assert) {
  let columnHeaders = document.querySelectorAll('th');
  assert.equal(columnHeaders.length, 5, 'all column headers are populated');
  assert.equal(columnHeaders[0].textContent, 'Product Name');
  assert.equal(columnHeaders[1].textContent, 'color');
  assert.equal(columnHeaders[2].textContent, 'weight (oz)');
  assert.equal(columnHeaders[3].textContent, 'category');
  assert.equal(columnHeaders[4].textContent, 'wireless');
});

QUnit.test('it shows correct inputs for selected property', function(assert) {
  let propertyDropdown = document.querySelector('#property-name');
  propertyDropdown.selectedIndex = 1;
  triggerEvent(propertyDropdown, 'change');

  let operatorDropdown = document.querySelector('#operator-dropdown');
  let valueInput = document.querySelector('input#value-input');
  let operatorOptions = operatorDropdown.options;

  assert.ok(operatorDropdown, 'operator drop down is present');
  assert.ok(valueInput, 'value input is present and not a select');
  assert.equal(operatorOptions.length, 5, 'only string operators are shown');
  assert.equal(operatorOptions[0].textContent, 'Equals');
  assert.equal(operatorOptions[1].textContent, 'Has any value');
  assert.equal(operatorOptions[2].textContent, 'Has no value');
  assert.equal(operatorOptions[3].textContent, 'Is any of');
  assert.equal(operatorOptions[4].textContent, 'Contains');
});

QUnit.test('it shows approriate enumberable options', function(assert) {
  let propertyDropdown = document.querySelector('#property-name');
  propertyDropdown.selectedIndex = 3; // change to 'category'
  triggerEvent(propertyDropdown, 'change');

  let valueInput = document.querySelector('select#value-input');
  let valueOptions = valueInput.options;

  assert.ok(valueInput, 'value input is present and is a select');
  assert.notOk(valueInput.multiple, 'single selection by default');
  assert.equal(valueOptions[0].textContent, 'tools');
  assert.equal(valueOptions[1].textContent, 'electronics');
  assert.equal(valueOptions[2].textContent, 'kitchenware');

  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 1; // change to 'Has any value'
  triggerEvent(operatorDropdown, 'change');

  assert.ok(valueInput.multiple, 'value input changes to multiple');
});

QUnit.module('string fields', {
  beforeEach() {
    selectProductName();
  },
  afterEach() {
    clear();
  }
});
QUnit.test('it filters based on name equality', function(assert) {
  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 6, 'all items are shown by default');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 'Headphones';
  apply();

  productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 1, 'one item shown');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones');
});

QUnit.test('it filters for names containing values', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 4;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 'k';
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 2, 'two items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Keyboard', 'is case insensitive');
  assert.equal(productItems[1].firstChild.textContent, 'Key');
});

QUnit.test('it filters for names of some values', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 1;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 'Headphones, Cup, Hammer';
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 3, 'two items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones');
  assert.equal(productItems[1].firstChild.textContent, 'Cup');
  assert.equal(productItems[2].firstChild.textContent, 'Hammer');
});

QUnit.test('it filters for names excluding some values', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 2;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 'Headphones, Cup, Hammer';
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 3, 'two items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Cell Phone');
  assert.equal(productItems[1].firstChild.textContent, 'Keyboard');
  assert.equal(productItems[2].firstChild.textContent, 'Key');
});

QUnit.module('number fields', {
  beforeEach() {
    selectWeight();
  },
  afterEach() {
    clear();
  }
});

QUnit.test('it shows equal weight', function(assert) {
  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 3;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 2, 'two items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Cell Phone');
  assert.equal(productItems[1].firstChild.textContent, 'Cup');
});

QUnit.test('it shows weights greater than value', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 1;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 3;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 3, 'three items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones'); // how heavy are headphones??
  assert.equal(productItems[1].firstChild.textContent, 'Keyboard');
  assert.equal(productItems[2].firstChild.textContent, 'Hammer');
});

QUnit.test('it shows weights less than value', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 2;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 3;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 1, 'one item shown');
  assert.equal(productItems[0].firstChild.textContent, 'Key');
});

QUnit.test('it shows weights including values', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 3;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = '3, 5';
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 4, 'four items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones');
  assert.equal(productItems[1].firstChild.textContent, 'Cell Phone');
  assert.equal(productItems[2].firstChild.textContent, 'Keyboard');
  assert.equal(productItems[3].firstChild.textContent, 'Cup');
});

QUnit.test('it shows weights excluding value', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 4;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('input#value-input');
  valueInput.value = 3;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 4, 'four items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones');
  assert.equal(productItems[1].firstChild.textContent, 'Keyboard');
  assert.equal(productItems[2].firstChild.textContent, 'Key');
  assert.equal(productItems[3].firstChild.textContent, 'Hammer');
});

QUnit.module('enumerated fields', {
  beforeEach() {
    selectCategory();
  },
  afterEach() {
    clear();
  }
});

QUnit.test('it shows selected categories', function(assert) {
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 2, 'two items shown');
  assert.equal(productItems[0].firstChild.textContent, 'Key');
  assert.equal(productItems[1].firstChild.textContent, 'Hammer');
});

QUnit.test('it shows selected categories', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 1;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('select#value-input');
  valueInput.options[0].selected = true;
  valueInput.options[1].selected = true;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 5, 'five items shown', 'show both `tools` and `electronics`');
  assert.equal(productItems[0].firstChild.textContent, 'Headphones');
  assert.equal(productItems[1].firstChild.textContent, 'Cell Phone');
  assert.equal(productItems[2].firstChild.textContent, 'Keyboard');
  assert.equal(productItems[3].firstChild.textContent, 'Key');
  assert.equal(productItems[4].firstChild.textContent, 'Hammer');
});

QUnit.test('it shows selected categories excluding values', function(assert) {
  let operatorDropdown = document.querySelector('#operator-dropdown');
  operatorDropdown.selectedIndex = 2;
  triggerEvent(operatorDropdown, 'change');

  let valueInput = document.querySelector('select#value-input');
  valueInput.options[0].selected = true;
  valueInput.options[1].selected = true;
  apply();

  let productItems = document.querySelectorAll('.product-item');
  assert.equal(productItems.length, 1, 'five items shown', 'show both `tools` and `electronics`');
  assert.equal(productItems[0].firstChild.textContent, 'Cup');
});
