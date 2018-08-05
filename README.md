# Product Filtering Condition Editor UI
A Coding Exercise for UI Developers

## My Approach

My initial thought was to do this in Ember, since that's where most of experience is and since it's the framework being used presently.
However, I decided I have enough examples speaking to my experience with Ember and decided to approach this with plain JavaScript (no jQuery, no Node.js).

## Creating the table

The first problem to solve was creating the table, since I had a variable number of products and variable number of properties.  In my HTML, I simply added a `<table id="products-data-table"></table>` element and nothing else.  The rows would have to be added dynamically since I couldn't rely on getting the same properties and items from the datastore.  I _did_ make the assumption that the properties and products would always follow the same format, however.

The very first function to run in my `scripts.js` file is `createTableHeader`, which literally creates the column headers by mapping the property names returned from the datastore.  I iterate over those names and create a `th` element for each.  This gives me the flexibility of accepting any number of properties (given that they follow the same format of having a `name` value);

The next thing I did was try to populate the table.  Similar to column headers, I needed to create these dynamically from a list of all the products.  Without going into too much details (since it was tedious), I did the same thing as before. Iterated over the products, creating a row for each, and then iterated over the _properties_ of those products to create `td` elements for each row.  Now I had a fully built HTML table.

## Filtering

The problem, however, was filtering down this collection of products and building the table from the filtered collection.  I knew that I didn't want to update the datastore directly, as I could lose records without any way of getting the back in a given session.  This is why I created a `product-store` class.  With this, I could copy from the global datastore, isolate all my filtering logic to one class and be able to reset at any time.  When thinking down the line, this would also make it easier if I wanted to add the ability for multiple filters (not done in this exercise, but having this class maintain state meant I could keep filtering the collection).  The `ProductStore` would take care of filtering the collection, dynamically calling the appropriate method based on the passed operator.

So now I had a full table and I could call the `applyFilter` method and pass it the values I needed.  The next problem to solve was building the inputs that allowed the user to select how they wanted to filter the collection.  Similarly, I dynamically created the initial `select` for which field the user wanted to filter on, as this would always be the same based on the values from the datastore.  This select drives most of the logic as a `string` based field will only have some operators and a text input while an `enumerated` based field would different operators and a select input.  I added an event listener to this select, which triggered the logic to build the other inputs based on the selections.

Now I had the second select being built dynamically, with the options populated based on the field type (i.e. `string` versus `number`).  I then had to add _another_ event listener to _this_ select, however, as the last input could changed based on the selection here.  For example, an `enumerated` field could be a single select or a multiple select based on the operator selected.  Once again, I had an HTML element being dynamically created based on user selections.

To apply the filter, I decided to force the user to click the `Apply` button.  Performance-wise, it's not that bad to have it update on every keystroke when the collection is this small, but if this were a promise-based system or if there were thousands of records, it would be too cumbersome.

## Tests

I used QUnit to write tests for the page (as that's what I'm most familiar with).  You can see them run in the `tests.html` file (they are written in `tests.js`).  I decided to do more acceptance-level testing as the application is so UI based -- unit tests wouldn't document it very well.  I cover cases of filtering by each type and asserting the write inputs are shown based on the user selection.  There are almost 300 lines of tests but they are mostly the same thing with different input types (I separated them by `modules` to make it easier to read).

| Operator | Description |
-----------|--------------
| Equals   | Value exactly matches |
| Is greater than | Value is greater than |
| Is less than  | Value is less than |
| Has any value | Value is present |
| Has no value  | Value is absent  |
| Is any of     | Value exactly matches one of several values |
| Contains      | Value contains the specified text |


| Property Type | Valid Operators |
---------------- | ----------------
| string | Equals |
| | Has any value |
| | Has no value |
| | Is any of |
| | Contains |
| number | Equals |
| | Is greater than |
| | Is less than |
| | Has any value |
| | Has no value |
| | Is any of |
| enumerated | equals |
| | Has any value |
| | Has no value |
| | Is any of |
