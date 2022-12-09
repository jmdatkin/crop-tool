import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trimDataURL } from '../src/util';
import sharp from 'sharp';

export default function handler (req: VercelRequest, res: VercelResponse) {
    const { dataURL, x, y, w, h } = req.query;   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(dataURL);

    // const b64 = trimDataURL(dataURL);
    // const image = sharp(b64);
    // image.resize({width: 100})
    // .then(output => {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     res.se
    //
};