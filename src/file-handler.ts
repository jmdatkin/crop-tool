const loadFile = function (file: File) {
    return loadImageFile(file);
};

const loadImageFile = function (file: File): Promise<string> {
    let fr = new FileReader();

    let p = new Promise<string>(function (resolve) {
        fr.onload = () => {
            resolve(fr.result as string)
        };
    });

    fr.readAsDataURL(file as Blob);
    return p;
};

export { loadFile }