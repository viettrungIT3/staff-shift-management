'use strict';

const Minio = require('minio');

let minioClient = null;

/**
 * Initialize MinIO client
 * @param {object} config - { endpoint, accessKey, secretKey, bucket }
 */
function init(config) {
  minioClient = new Minio.Client({
    endPoint: new URL(config.endpoint).hostname,
    port: Number(new URL(config.endpoint).port) || 9000,
    useSSL: config.endpoint.startsWith('https'),
    accessKey: config.accessKey,
    secretKey: config.secretKey
  });
  
  return minioClient;
}

/**
 * Get MinIO client instance
 */
function getClient() {
  if (!minioClient) {
    throw new Error('MinIO client not initialized. Call init() first.');
  }
  return minioClient;
}

/**
 * Ensure bucket exists, create if not
 * @param {string} bucketName 
 */
async function ensureBucket(bucketName) {
  const client = getClient();
  const exists = await client.bucketExists(bucketName);
  if (!exists) {
    await client.makeBucket(bucketName);
    console.log(`Bucket created: ${bucketName}`);
  }
}

/**
 * Upload file to MinIO
 * @param {string} bucketName 
 * @param {string} objectName 
 * @param {Buffer|string} data 
 * @param {string} contentType 
 */
async function uploadFile(bucketName, objectName, data, contentType) {
  const client = getClient();
  await client.putObject(bucketName, objectName, data, {
    'Content-Type': contentType || 'application/octet-stream'
  });
  console.log(`File uploaded: ${bucketName}/${objectName}`);
}

/**
 * Download file from MinIO
 * @param {string} bucketName 
 * @param {string} objectName 
 */
async function downloadFile(bucketName, objectName) {
  const client = getClient();
  return new Promise((resolve, reject) => {
    const chunks = [];
    client.getObject(bucketName, objectName, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  });
}

/**
 * Get signed URL for download
 * @param {string} bucketName 
 * @param {string} objectName 
 * @param {number} expirySeconds 
 */
async function getSignedUrl(bucketName, objectName, expirySeconds = 3600) {
  const client = getClient();
  return client.presignedGetObject(bucketName, objectName, expirySeconds);
}

module.exports = {
  init,
  getClient,
  ensureBucket,
  uploadFile,
  downloadFile,
  getSignedUrl
};
