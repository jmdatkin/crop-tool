const loadFile = function (file: DataTransferItem) {
    return loadImageFile(file);
};

const loadImageFile = function (image: DataTransferItem): Promise<string> {
    let fr = new FileReader();
    let im = new Image();
    let file = image.getAsFile();

    let p = new Promise<string>(function (resolve) {
        fr.onload = () => {
            resolve(fr.result as string)
        };
    });

    fr.readAsDataURL(file as Blob);
    return p;
};

export { loadFile }