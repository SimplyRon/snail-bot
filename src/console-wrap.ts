import * as colors from "colors"

const con = {
    log(message: string) { console.log(message); },
    error(message: string) { console.log(colors.red(message)); },
    warn(message: string) { console.log(colors.yellow(message)); },
    info(message: string) { console.log(colors.green(message)); },
    debug(message: string) { console.log(colors.blue(message)); }
};

export { con as console };