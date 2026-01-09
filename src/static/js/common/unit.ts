console.log('window.')
export const valFormat = (val: number | string) => {
    const res = Number(val);
    if (res < 0) {
        const positive = Math.abs(res);
        if (positive > 10000 && positive < 100000000) {
            return (-positive / 10000).toFixed(2);
        }
        if (positive >= 100000000) {
            return (-positive / 100000000).toFixed(2);
        }
        else {
            return -res.toFixed(2);
        }
    }
    else {
        if (res > 10000 && res < 100000000) {
            return (res / 10000).toFixed(2);
        }
        if (res >= 100000000) {
            return (res / 100000000).toFixed(2);
        }
        else {
            return Number(res).toFixed(2);
        }
    }

}
export const valUnit = (val: number | string) => {
    const res = Number(val);
    if (res < 0) {
        const positive = Math.abs(res);
        if (positive > 10000 && positive < 100000000) {
            return window.$i18nMFunc('utils.unit.tenThousand');
        }
        if (positive >= 100000000) {
            return window.$i18nMFunc('utils.unit.hundredMillion');
        }
        if(positive < 10000){
            return window.$i18nMFunc('')
        }
    }
    else {
        if (res > 10000 && res < 100000000) {
            return window.$i18nMFunc('utils.unit.tenThousand');
        }
        if (res >= 100000000) {
            return window.$i18nMFunc('utils.unit.hundredMillion');
        }
        if(res < 10000){
            return window.$i18nMFunc('')
        }
    }

}
