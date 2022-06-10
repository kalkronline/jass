import { fileURLToPath } from 'url';
import { readFile } from 'fs';
import { join, resolve } from 'path';

// trick that uses a stack trace to get the file location of the
// caller. Takes in a string to adjust to a relative position :)
function relPath(rel) {
    try {throw new Error()}
    catch (e) {
        let stack = e.stack.split('\n');
        while (stack.length != 0) {
            const test = stack.pop( ).match(/file:.*js/)
            if (test) {
                stack = test;
                break;
            }
        }
        return join(fileURLToPath(stack["0"]), '../', rel || "");
    }
}

function readFileAsync (path) {
    return new Promise((resolve, reject) => {
        readFile(path, (error, response) => {
            if (error) reject(error);
            resolve((response || "").toString())
        })
    })
}

class Mixins {
    constructor () {
        // remove comments
        this.#addDefault(t => {
            t = t.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, ' ')
            return t
        });
        // resolve imports
        this.#addDefault((t, {path}) => {
            const rpfunc = match => {
                if (match[0] !== '.') return match;
                return 'file:' + resolve(path, '../', match)
            }
            t = t.replace(/(?<=^import .*?['"])(.*?)(?=['"])/gm, rpfunc)
            t = t.replace(/(?<=import\(['"]).*?(?=['"])/gm, rpfunc)
            return t;
        })
    }

    #pre     = [];
    #default = [];

    add(mixin) {
        this.#pre.push(mixin);
    }

    #addDefault (mixin) {
        this.#default.push(mixin)
    }
    
    apply(t, params) {
        for (const mixin of this.#pre) {
            t = mixin(t, params)
        }
        for (const mixin of this.#default) {
            t = mixin(t, params)
        }
        return t;
    }
}


export default class Isomod {
    mixins = new Mixins;
    
    async import(path) {
        // check if import has already run
        if (!this.mixins) return;
        
        const moduleText = await readFileAsync(relPath(path));
        const mixedinText = this.mixins.apply(moduleText, {
            path: path
        });
        // console.log(mixedinText)
        const module = await import('data:text/javascript;base64,'+Buffer.from(mixedinText).toString('base64'));

        // set this object's properties to those of the module
        Object.getOwnPropertyNames(this).map(name => delete this[name]);
        return Object.assign(this, module)
    }
}