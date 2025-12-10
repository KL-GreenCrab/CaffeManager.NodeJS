import { getJson, authFetch } from '../api';

async function testConnection() {
  console.log('Testing backend connection...');
  
  try {
    const response = await fetch('http://localhost:3000/products');
    console.log('✓ Direct fetch to backend works', response.status);
  } catch (err) {
    console.error('✗ Direct fetch failed:', err);
  }

  try {
    const data = await getJson('/products');
    console.log('✓ API helper works:', data);
  } catch (err) {
    console.error('✗ API helper failed:', err);
  }
}

export default testConnection;
