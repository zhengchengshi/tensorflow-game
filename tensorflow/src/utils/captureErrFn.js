export default function captureErrFn (promise) {
    return promise.then(data => {
        return [null, data]
    }).catch(err => [err])
}