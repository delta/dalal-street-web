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