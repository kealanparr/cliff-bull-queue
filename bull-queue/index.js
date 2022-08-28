const Queue = require("bull");

const orderQueue = new Queue('orderqueue', 'redis://127.0.0.1:6379');

var orderNumber = 1;
var runningTotal = 0;
const ordersToAdd = 10000;

function getRandValue(min, max, decimals) {
    return parseFloat(Math.floor(Math.random() * (max - min) ) + min).toFixed(2);
}

async function generate() {
    for(i = 0; i < ordersToAdd; i++){
        orderValue = parseFloat(getRandValue(1.99,100,2));
        job = await orderQueue.add('orders', { orderNo: orderNumber, orderValue: orderValue });
        console.log(`Generating order: ${orderNumber}`);
        orderNumber = orderNumber + 1;
        runningTotal = runningTotal + orderValue;
    }
}

async function main() {
    console.clear()
    const start = new Date();
    await generate();
    const stop = new Date();
    console.log(`Total value of orders added: ${runningTotal.toFixed(2)}`);
    console.log(`Time = ${(stop - start)/1000} seconds`)
    process.exit();
}

main();