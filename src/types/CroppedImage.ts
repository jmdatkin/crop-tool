type CroppedImage = {
    dataURL: string,
    filename: string,
    metadata:  {
        width: number,
        height: number,
        type: string,
    }
};

export default CroppedImage;