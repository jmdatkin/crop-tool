const loadFile = function (file: DataTransferItem) {
    // if (file.type.indexOf('image') < 0 || file.kind !== 'file')
    //     return Promise.reject("Only images are allowed to be uploaded");
    // else
        return loadImageFile(file);
    // .then(im => {
    //     console.log(im);
    // });
};

const loadImageFile = function (image: DataTransferItem): Promise<string> {
    console.log("Im here")
    let fr = new FileReader();
    let im = new Image();
    let file = image.getAsFile();

    let p = new Promise<string>(function (resolve) {
        fr.onload = () => {
            console.log(fr.result);
            resolve(fr.result as string)
        };
    });

    fr.readAsDataURL(file);
    return p;
};

export { loadFile }