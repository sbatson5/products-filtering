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
    if (resetStore) {
      this.resetProducts();
    }
    let index = field.id;
    this.products = this.products.filter((product) => {
      return this[operator]((product.property_values[index] || {}).value, value);
    });
  }

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
