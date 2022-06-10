import Isomod from "./isomod.js";
import Tests from './tests.js';

const tests = new Isomod();

tests.mixins.add(text => {
    text = text.replace(/^test: ?(.*?) ?=>.*/gm, 
        `export function __JASS__$1() {
            console.log('running tests for $1')`
    )
    return text;
})

const state = {state: true};

await tests.import('../src/index.js');
tests[Object.keys(tests)[0]].apply(input => new Tests(input, state))

console.log(state.state ? 'sick win on the testing side of things' : 'there was an epic fail')
process.exit(state.state ? 0 : 1);