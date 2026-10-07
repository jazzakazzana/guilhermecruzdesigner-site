import { json } from '../../_lib/works.js';
export async function onRequestGet({ data }) {
  return json({ email: data.email || '' });
}
