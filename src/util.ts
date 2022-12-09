const trimDataURL = function(dataURL) {
    return dataURL.replace(/^data:image.+;base64,/, '');
};

export { trimDataURL };