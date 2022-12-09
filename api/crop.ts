import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trimDataURL } from '../src/util';
import sharp from 'sharp';

export default function handler (request: VercelRequest, response: VercelResponse) {
    const { dataURL, x, y, w, h } = request.query;   
    const b64 = trimDataURL(dataURL);
    const image = sharp(b64);
    image.resize({width: 100})
    .then(output => response.send(output));
};