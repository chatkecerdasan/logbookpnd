const GAS_URL = 'https://script.google.com/macros/s/AKfycbwW9bzIFhEiNAcJIXWyQMsanDi81oBe1eRsJku5tpKNQfgMv6oAvw77dQV4G-Vl9PGyxw/exec';

export default async function handler(req, res) {
  try {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(req.query || {})) {
      if (value === undefined || value === null) continue;
      if (key === 'callback') continue;

      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }

    const url = `${GAS_URL}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    const text = await response.text();

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(response.status).send(text);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(500).json({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
}
