const ShoppingService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping list service object', function () {
    let db 
    let testItems = [
        {
            id: 1,
            name: 'Beef Jerky',
            price: '5.99',
            date_added: new Date(),
            checked: true,
            category: 'Snack',
        },
        {
            id: 2,
            name: 'Tonkotsu Ramen',
            price: '2.39',
            date_added: new Date(),
            checked: true,
            category: 'Lunch',
        },
        {
            id: 3,
            name: 'Veggie Curry',
            price: '10.29',
            date_added: new Date(),
            checked: true,
            category: 'Main',
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.SL_DB_URL
        })
    })

    // after(() => db.destroy())

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    context(`----- Given 'shopping_list' has data -----`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getById() returns an article by id from 'shoppig_list' table`, () => {
            const thirdId = 3
            const thirdItem = testItems[thirdId -1]
            return ShoppingService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdItem.name,
                        price: thirdItem.price,
                        date_added: thirdItem.date_added,
                        checked: thirdItem.checked,
                        category: thirdItem.category
                    })
                })
        })

        it(`getAllItems() returns all items from 'shopping_list`, () => {
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingService.deleteItem(db, itemId)
                .then(() => ShoppingService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'Updated name',
                price: '11.11',
                date_added: new Date(),
                checked: false,
                category: 'Main',
            }
            return ShoppingService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    })
                })
        })
    })




})