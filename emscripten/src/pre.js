//var Module = typeof Module !== 'undefined' ? Module : {};
// (to avoid errors occurred in emscripten's code)
var document = typeof document !== 'undefined' ? document : {};
var window = typeof window !== 'undefined' ? window : {};
// expose wasm API to AudioWorklet
if (typeof AudioWorkletGlobalScope !== 'undefined' && AudioWorkletGlobalScope) {
    AudioWorkletGlobalScope.atob = typeof atob=="function" ? atob : function (input) {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        } while (i < input.length);
        return output;
    };

    AudioWorkletGlobalScope.wasmModule = Module;
    AudioWorkletGlobalScope.wasmAddFunction = addFunction;
    AudioWorkletGlobalScope.wasmRemoveFunction = removeFunction;
    AudioWorkletGlobalScope.addOnPreRun = addOnPreRun;
    AudioWorkletGlobalScope.addOnInit = addOnInit;
    AudioWorkletGlobalScope.addOnPostRun = addOnPostRun;
}
