import { RNS3 } from 'react-native-aws3';

export function awsuploadImageToBucket(file, prefix) {
    const options = {
        keyPrefix: prefix,
        bucket: "eashaproductsbucket",
        region: "ap-northeast-1",
        accessKey: "AKIAWCYLG2EKSGW4QTNB",
        secretKey: "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",
        successActionStatus: 201,
    }
    return new Promise((resolve, reject) => {
        RNS3.put(file, options).then(response => {
            console.log(response);
            if (response.status !== 201) {
                return reject(-1);
            } else {
                console.log(response.body);
                return resolve({url: response.body.postResponse.location, key: response.body.postResponse.key});
            }
            /**
             * {
             *   postResponse: {
             *     bucket: "your-bucket",
             *     etag : "9f620878e06d28774406017480a59fd4",
             *     key: "uploads/image.png",
             *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
             *   }
             * }
             */
        });
    })

}
