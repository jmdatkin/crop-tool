import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trimDataURL } from '../src/util';
import sharp from 'sharp';

export default function handler (req: VercelRequest, res: VercelResponse) {
    const { dataURL, x, y, w, h } = JSON.parse(req.body);

    const b64 = (dataURL as string).replace(/^data:image.+;base64,/, '');

    const buffer = Buffer.from(b64, 'base64');

    const image = sharp(buffer);
    image.extract({
        left: x,
        top: y,
        width: w,
        height: h
    })
    // image.extract({
    //     left: 0,
    //     top: 0,
    //     width: 100,
    //     height: 200
    // })
    .jpeg({
        quality: 75
    })
    .toBuffer()
    .then(output => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(`data:image/jpeg;base64,${output.toString('base64')}`);
    });
};