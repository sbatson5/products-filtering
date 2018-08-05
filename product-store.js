class ProductStore {
  constructor() {
    this.products = datastore.getProducts();
  }

  get originalProducts() {
    return datastore.getProducts();
  }

  resetProducts() {
    this.products = datastore.getProducts();
  }

  applyFilter(field, operator, value, resetStore = true) {
    // this is always true as-is, however, I wanted to open up a solution
    // for if I wanted to add multiple filters
    // rather than iterating each filter, the second filter could work
    // with the existing, filtered products store by passing `false`
    if (resetStore) {
      this.resetProducts();
    }
    let index = field.id;
    this.products = this.products.filter((product) => {
      // this dynamically calls the correct operator method below
      // based on which operator string is passsed in
      return this[operator]((product.property_values[index] || {}).value, value);
    });
  }

  // one operator method for each possible operator at the moment
  // this couldn't really be built dynamically as I wouldn't be able to
  // determine the return values based on the names alone 

  equals(productValue, givenValue) {
    return productValue == givenValue;
  }

  any(productValue, givenValue) {
    return givenValue.includes(productValue);
  }

  none(productValue, givenValue) {
    return !this.any(productValue, givenValue);
  }

  in(productValue, givenValue) {
    return this.any(productValue, givenValue);
  }

  contains(productValue, givenValue) {
    return productValue.toLowerCase().includes(givenValue.toLowerCase());
  }

  greater_than(productValue, givenValue) {
    return productValue > parseFloat(givenValue);
  }

  less_than(productValue, givenValue) {
    return productValue < parseFloat(givenValue);
  }
}
