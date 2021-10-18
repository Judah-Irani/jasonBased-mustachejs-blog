const expectedOrigin = "https://livearea-pilot-approuter-caas2-sap.cfapps.us10.hana.ondemand.com";

const script = [];

window.addEventListener(
    "message",
    event => {
        if(event.origin === expectedOrigin) {
            script.push(event.data);
            document.getElementById("eventPrintout").innerHTML = JSON.stringify(script, null, 4);
        }
    },
    false
)

sendStartupEvents();

// required startup events to notify the consumer app of readiness and preferred iframe size
function sendStartupEvents() {
    let initEvent = { type: 'initialized' , data: null};
    this.sendMessage(initEvent);

    let sizeEvent = { type: 'sizeChange', data: { height: 400}}
    this.sendMessage(sizeEvent);
}

function sendMessage(event) {
    // web
    if (window.parent !== window) {
        window.parent.postMessage(event, expectedOrigin);
    }
    // android
    else if (((window).Android)) {
        ((window).Android).sendMessage(JSON.stringify(event));
    }
    // ios
    else if ((window).webkit && (window).webkit.messageHandlers && (window).webkit.messageHandlers.upscaleHandler) {
        (window).webkit.messageHandlers.upscaleHandler.postMessage(JSON.stringify(event));
    }
    else {
        console.log('no send method detected');
    }
}
