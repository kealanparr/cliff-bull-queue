const Queue = require("bull");

var runningTotal = 0;

const orderQueue = new Queue('orderqueue', 'redis://127.0.0.1:6379');

function processOrder(order) {
    orderValue = parseFloat(order.data.orderValue)
    orderTax = (orderValue * 0.2);
    orderShipping = 3.99;
    orderTotal = (orderValue + orderTax + orderShipping).toFixed(2);
    console.log(`Processing Order No: ${order.data.orderNo} Total Value = ${parseFloat(orderTotal)}`);
    runningTotal = runningTotal + parseFloat(orderTotal);
}

async function main() {
    console.clear()
    orderQueue.process('orders', async (job) => {
        return processOrder(job);
    });
    orderQueue.on('completed', (job, result) => {
        console.log(`Total value of orders processed so far: ${parseFloat(runningTotal.toFixed(2))}\n`);//
        job.remove();
    });
    
}

main();
