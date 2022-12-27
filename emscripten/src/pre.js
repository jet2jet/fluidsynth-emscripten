//var Module = typeof Module !== 'undefined' ? Module : {};
// (to avoid errors occurred in emscripten's code)
var document = typeof document !== 'undefined' ? document : {};
var window = typeof window !== 'undefined' ? window : {};
// expose wasm API to AudioWorklet
if (typeof AudioWorkletGlobalScope !== 'undefined' && AudioWorkletGlobalScope) {
    AudioWorkletGlobalScope.wasmModule = Module;
    AudioWorkletGlobalScope.wasmAddFunction = addFunction;
    AudioWorkletGlobalScope.wasmRemoveFunction = removeFunction;
    AudioWorkletGlobalScope.addOnPreRun = addOnPreRun;
    AudioWorkletGlobalScope.addOnInit = addOnInit;
    AudioWorkletGlobalScope.addOnPostRun = addOnPostRun;
}
