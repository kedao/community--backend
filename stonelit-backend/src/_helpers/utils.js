export const lenString = (str) => {
    return str.replace(/[\u4e00-\u9fa5]/g, "**").length;
}

export const subString = (str, n, append = " ...") => {
    if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
        return str;
    } else {
        let len = 0;
        let tmpStr = "";
        for (let i = 0; i < str.length; i++) {
            if (/[\u4e00-\u9fa5]/.test(str[i])) {
                len += 2;
            }
            else {
                len += 1;
            }
            if (len > n) {
                break;
            }
            else {
                tmpStr += str[i];
            }
        }
        return tmpStr + append;
    }
}
