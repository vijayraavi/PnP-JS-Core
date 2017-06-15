import { Logger, LogLevel } from "./logging";

export function deprecated(deprecationVersion: string, message: string) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const method = descriptor.value;

        descriptor.value = function (this: any, ...args: any[]) {
            Logger.log({
                data: {
                    descriptor: descriptor,
                    propertyKey: propertyKey,
                    target: target,
                },
                level: LogLevel.Warning,
                message: `(${deprecationVersion}) ${message}`,
            });

            return method.apply(this, args);
        };
    };
}
