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