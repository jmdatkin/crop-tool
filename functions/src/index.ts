import * as functions from "firebase-functions";
import * as sharp from "sharp";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const exists = (x: any) => typeof x !== 'undefined';

export const crop = functions.https.onRequest((req, res) => {

    functions.logger.log(req.body);

    const { dataURL, left, top, width, height, outputWidth, outputHeight } = JSON.parse(req.body);

    // if (!exists(dataURL) ||
    //     !exists(left) ||
    //     !exists(top) ||
    //     !exists(width) ||
    //     !exists(height)) {
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.status(400);
    //     res.send("Error: Arguments missing or improperly formatted");
    // }

    const b64 = (dataURL as string).replace(/^data:image.+;base64,/, '');

    const buffer = Buffer.from(b64, 'base64');

    const pipeline = sharp(buffer);
    pipeline.extract({
        left: left,
        top: top,
        width: width,
        height: height,
    });

    if (exists(outputWidth) && exists(outputHeight)) {
        pipeline.resize({
            width: outputWidth,
            height: outputHeight
        });
    }
    // image.extract({
    //     left: 0,
    //     top: 0,
    //     width: 100,
    //     height: 200
    // })
    pipeline.jpeg({
        quality: 75,
    })
        .toBuffer()
        .then(output => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(`data:image/jpeg;base64,${output.toString("base64")}`);
        });
});
