import * as functions from "firebase-functions";
import * as sharp from "sharp";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const crop = functions.https.onRequest((req, res) => {
    const { dataURL, x, y, w, h } = JSON.parse(req.body);

    const b64 = (dataURL as string).replace(/^data:image.+;base64,/, '');

    const buffer = Buffer.from(b64, 'base64');

    const image = sharp(buffer);
    image.extract({
        left: x,
        top: y,
        width: w,
        height: h,
    })
        // image.extract({
        //     left: 0,
        //     top: 0,
        //     width: 100,
        //     height: 200
        // })
        .jpeg({
            quality: 75,
        })
        .toBuffer()
        .then(output => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(`data:image/jpeg;base64,${output.toString("base64")}`);
        });
});
