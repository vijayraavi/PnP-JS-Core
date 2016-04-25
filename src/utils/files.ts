"use strict";

export function readBlobAsText(blob: Blob): Promise<string> {
    return readBlobAs<string>(blob, "string");

}

export function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return readBlobAs<ArrayBuffer>(blob, "buffer");
}

function readBlobAs<T>(blob: Blob, mode: "string" | "buffer"): Promise<T> {

    return new Promise<T>((resolve, reject) => {

        let reader = new FileReader();
        reader.onload = (e: FileReaderEvent<T>) => {
            resolve(e.target.result);
        };

        switch (mode) {
            case "string":
                reader.readAsText(blob);
                break;
            case "buffer":
                reader.readAsArrayBuffer(blob);
                break;
        }
    });
}

interface FileReaderEventTarget<T> extends EventTarget {
    result: T;
}

interface FileReaderEvent<T> extends Event {
    target: FileReaderEventTarget<T>;
    getMessage(): string;
}
