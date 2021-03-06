const AWS = require('aws-sdk');


let ssmData = {};


const getSSMParamAsync = async function () {
    try {
        const path = process.argv[3];
        const region = process.argv[2];
        if (!path) path = '/';
        if (!region) throw new Error('region is not provided');
        const ssm = new AWS.SSM({
            region
        });

        let data = await getAllParamProm(ssm, path);
        let completeData = data.Parameters;
        while (data && data.NextToken) {
            data = await getAllParamProm(ssm, path, data.NextToken);
            completeData = [...completeData, ...data.Parameters];
        }
        if (completeData && completeData.length > 0) {
            parseData(completeData, path);
        }


    } catch (e) {
        throw new Error(e);
        // console.log(process.argv);
    }

}

const getAllParamProm = function (ssm, path, NextToken) {
    if (NextToken) {
        return new Promise((resolve, reject) => {
            ssm.getParametersByPath({
                Path: path,
                Recursive: true,
                NextToken,
                WithDecryption: true
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {

                    resolve(data);
                }
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            ssm.getParametersByPath({
                Path: path,
                Recursive: true,
                WithDecryption: true
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {

                    resolve(data);
                }
            })
        })
    }
}

const parseData = function (data, path) {
    while (data.length > 0) {
        let element = data.shift();

        let elementArr = element.Name.replace(path, '').split('/').filter(val => val !== '');
        let key = {}
        if (elementArr.length > 0) {
            if (elementArr.length === 1) {
                if (!ssmData[elementArr[0]]) ssmData[elementArr[0]] = element.Value;
            } else {

                for (var i = 1; i < elementArr.length; i++) {
                    if (i === elementArr.length - 1) {
                        key[elementArr[i]] = element.Value;
                    } else {
                        key = key[elementArr[i]] = {};
                    }
                }
                if (typeof ssmData[elementArr[0]] === 'object' && ssmData[elementArr[0]] !== null && ssmData[elementArr[0]] !== undefined) {
                    ssmData[elementArr[0]] = {
                        ...ssmData[elementArr[0]],
                        ...key
                    }
                } else {
                    ssmData[elementArr[0]] = key;
                }


            }
        }

    }
    console.log(JSON.stringify(ssmData));
}


getSSMParamAsync()





