declare var PNotify: any;

export function showNotif(msg: string, title = "New notification") {
    PNotify.notice({
        title: title,
        text: msg,
        addClass: "pnotify-style",
    });
}

export function showErrorNotif(msg: string, title = "Error!") {
    PNotify.notice({
        title: title,
        text: msg,
        addClass: "pnotify-style",
    });
}

export function showSuccessNotif(msg: string, title = "Success") {
    PNotify.success({
        title: title,
        text: msg,
        addClass: "pnotify-style",
    });
}

export function showInfoNotif(msg: string, title: string) {
    PNotify.info({
        title: title,
        text: msg,
        addClass: "pnotify-style",
    });
}

export function isPositiveInteger(x: number): boolean {
    return (!isNaN(x) && x % 1 === 0 && x > 0);
}

export function addCommas(x: number | string) : string {
    let a = (x + "").split("").reverse();
    let len = a.length;
    let isNeg = false;
    if (a[len-1] == "-") {
        len--;
        isNeg = true;
    }
    let s = "";
    for (let i = 0; i < len; i++) {
        s += a[i];
        if (i != 0 && i % 2 == 0 && i < len-1) {
            s += ",";
        }
    }
    return (isNeg ? "-" : "") + s.split("").reverse().join("");
}
