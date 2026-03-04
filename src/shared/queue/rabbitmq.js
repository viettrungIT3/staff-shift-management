'use strict';

const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ
 * @param {string} url - RabbitMQ connection URL
 * @returns {Promise<import('amqplib').Channel>}
 */
async function connect(url) {
  if (channel) return channel;
  
  connection = await amqp.connect(url);
  channel = await connection.createChannel();
  
  // Handle connection close
  connection.on('close', () => {
    console.log('RabbitMQ connection closed');
    channel = null;
    connection = null;
  });
  
  connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err);
  });
  
  console.log('RabbitMQ connected');
  return channel;
}

/**
 * Assert queue exists
 * @param {string} queueName 
 * @param {object} options
 */
async function assertQueue(queueName, options = { durable: true }) {
  if (!channel) throw new Error('RabbitMQ not connected');
  return channel.assertQueue(queueName, options);
}

/**
 * Publish message to queue
 * @param {string} queueName 
 * @param {object} message 
 */
async function publish(queueName, message) {
  if (!channel) throw new Error('RabbitMQ not connected');
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });
}

/**
 * Consume messages from queue
 * @param {string} queueName 
 * @param {Function} handler 
 */
async function consume(queueName, handler) {
  if (!channel) throw new Error('RabbitMQ not connected');
  await channel.prefetch(1);
  
  channel.consume(queueName, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        await handler(content);
        channel.ack(msg);
      } catch (err) {
        console.error('Error processing message:', err);
        // Reject and requeue on error
        channel.nack(msg, false, true);
      }
    }
  });
  
  console.log(`Consuming from queue: ${queueName}`);
}

/**
 * Close connection
 */
async function close() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  channel = null;
  connection = null;
}

module.exports = {
  connect,
  assertQueue,
  publish,
  consume,
  close
};
