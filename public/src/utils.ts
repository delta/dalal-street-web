declare var PNotify: any;

export function showNotif(msg: string, title = "New notification") {
    let pnotifyNotif = PNotify.notice({
        title: title,
        text: msg,
        addClass: "pnotify-style",
        modules: {
            NonBlock: {
                nonblock: true
            }
        },
    });
}

export function isPositiveInteger(x: number): boolean {
    return (!isNaN(x) && x % 1 === 0 && x > 0);
}