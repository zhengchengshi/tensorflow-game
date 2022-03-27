export default function throttle(cd,time){
    var t = null;
    return function(){
        if(t) return;
        t = setTimeout(() => {
            cd.call(this);
            t = null;
        }, time);
    }
}