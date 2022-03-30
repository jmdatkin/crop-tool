import EventBus from "./events";

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
    let fr = new FileReader();
    let im = new Image();
    let file = image.getAsFile();

    let p = new Promise<string>(function (resolve) {
        fr.onprogress = (e) => {
            EventBus.emit('image-load-progress', e.loaded/e.total);
            console.log(e.loaded);
            console.log(e.total);
            console.log('progress');
        }
        fr.onload = () => {
            resolve(fr.result as string)
        };
    });

    fr.readAsDataURL(file);
    return p;
};

export { loadFile }