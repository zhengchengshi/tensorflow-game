/**
 * 
 * @param {*键盘对应ASCII码} keyCode 
 * @returns 
 */
export default function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            key.press();
            key.isDown = true;
            // key.isUp = false;
        }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    // window.addEventListener(
    //     "keyup", key.upHandler.bind(key), false
    // );
    // console.log(key)

    return key;
}