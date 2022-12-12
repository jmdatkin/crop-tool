type CroppyImage = {
    dataURL: string,
    filename: string,
    metadata:  {
        width: number,
        height: number,
        size: number,
        type: string,
    }
};

export default CroppyImage;