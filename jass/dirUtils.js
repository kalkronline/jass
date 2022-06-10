import { readdir } from 'fs';
import { join } from 'path';

function areaddir(path) {
    return new Promise((resolve, reject) => {
        readdir(path, (error, response) => {
            if (error)
                reject(error);
            if (!error)
                resolve(response);
        });
    });
}

export async function forDir(dir, cb) {
    for(const file of await areaddir(dir))
        await cb(join(dir, file))
}