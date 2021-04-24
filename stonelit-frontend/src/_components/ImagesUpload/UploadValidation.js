export default class UploadValidation {

    constructor(files, uploadStates) {
        this.files = files;
        this.uploadStates = uploadStates;
    }

    checkHasError() {
        for (let datum of this.files) {
            if (datum.type === 'new' && this.uploadStates[datum.id] && this.uploadStates[datum.id].error) {
                return true;
            }
        }

        return false;
    }

    checkIsUploading() {
        for (let datum of this.files) {
            if (datum.type === 'new' && this.uploadStates[datum.id] && this.uploadStates[datum.id].finished !== true) {
                return true;
            }
        }

        return false;
    }

    getFileUrls() {
        const urls = [];

        for (let datum of this.files) {
            if (datum.type === 'new' && this.uploadStates[datum.id]) {
                urls.push(this.uploadStates[datum.id].url);
            }
        }

        return urls;
    }

}

