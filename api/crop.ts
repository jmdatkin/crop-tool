import sharp from 'sharp';

export default function handler (request, response) {
    const { dataURL } = request.query;   
    const image = sharp();
};