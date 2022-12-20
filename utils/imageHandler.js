import RNFetchBlob from 'rn-fetch-blob';

export async function imageSizeHandler(size) {
    return new Promise((resolve, reject) => {
        const compressSizer = size => {
            const MB = size / Math.pow(1024, 2);
            if (Math.round(MB) === 0) return 100;
            if (Math.round(MB) === 1) return 90;
            if (Math.round(MB) === 2) return 80;
            if (Math.round(MB) === 3) return 70;
            if (Math.round(MB) === 4) return 60;
            if (Math.round(MB) >= 5) return 50;
            if (Math.round(MB) >= 10) return 40;
            if (Math.round(MB) >= 15) return 30;
            if (Math.round(MB) >= 20) return 20;
            if (Math.round(MB) >= 25) return 10;
        };
        const compress = compressSizer(size);
        return resolve(compress);
    }).catch(error => {
        console.log(error)
        return reject(-1);
    })
}