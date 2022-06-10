export default class Tests {
    result;
    programState;

    constructor(result, state) {
        this.result = result;
        this.programState = state;
    }

    #log(cb) {
        const res = cb();
        console.log(res ? 'test passed!!' : 'test fail...')
        if (this.programState.state)
            this.programState.state = res;
    }

    is(expected) {
        this.#log(() => {
            if (Array.isArray(expected))
                return this.result.length === expected.length && 
                    this.result.every((el, ix) => el === expected[ix]);
            return this.result === expected;
        })
    }
}