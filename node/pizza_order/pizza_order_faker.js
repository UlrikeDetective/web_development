const fs = require('fs');
const faker = require('faker');

const NUM_RECORDS = 100; // Number of records to generate

// Function to generate random data
function generateData() {
    const data = [];
    for (let i = 0; i < NUM_RECORDS; i++) {
        const order = {
            order_id: `PYPIZZA${i + 1}`,
            name: faker.name.findName(),
            size: faker.random.arrayElement(['S', 'M', 'L']),
            add_pepperoni: faker.random.arrayElement(['Y', 'N']),
            extra_cheese: faker.random.arrayElement(['Y', 'N']),
            additional_extras: faker.lorem.words(faker.random.number({ min: 0, max: 5 })),
            drink: faker.random.arrayElement(['Y', 'N']),
            size_cost: faker.random.number({ min: 10, max: 20 }),
            pepperoni_cost: faker.random.number({ min: 0, max: 2 }),
            cheese_cost: faker.random.number({ min: 0, max: 1 }),
            drink_cost: faker.random.number({ min: 0, max: 1 }),
            extra_cost: faker.random.number({ min: 0, max: 5 }),
            total_cost: faker.random.number({ min: 10, max: 30 }),
            order_date: faker.date.recent().toISOString().split('T')[0]
        };
        data.push(order);
    }
    return data;
}

// Generate data and save to CSV file
const orders = generateData();
const csvData = orders.map(order => Object.values(order).join(',')).join('\n');
fs.writeFileSync('pizza_delivery_generated.csv', csvData);

console.log('Data generated and saved to pizza_delivery_generated.csv');
