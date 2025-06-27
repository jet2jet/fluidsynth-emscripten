# FluidSynth with Emscripten-specific patch

This repository is based on [FluidSynth](https://github.com/FluidSynth/fluidsynth) repository, and contains some changes to build with Emscripten.

The original README is here: [README.original.md](./README.original.md)

To use the synthesizer easily, consider using [js-synthesizer](https://github.com/jet2jet/js-synthesizer), which wraps fluidsynth-emscripten.

## Build

> Tested with Emscripten version 3.1.10.

1. (Optional) Update `emscripten/exports.txt`, containing export functions for JS program
    * The script `emscripten/make-exports.js` will update this automatically, gathering functions from `include` directory.
2. Make sure that Emscripten is usable on the current environment
3. Make `build` directory
4. Enter `build` directory and execute `emcmake cmake -Denable-oss=off -DCMAKE_BUILD_TYPE=Release ..`
    * If no other options are specified, and `cmake` is running with `emcmake` (or `emconfigure`), the build configurations are initialized for Emscripten-build mode.
5. In `build` directory, execute `emmake make`

After successful build, `libfluidsynth-<version>.js` will be created at `build/src` directory.

* If `enable-debug` specified on the `cmake` execution (e.g. `emcmake cmake -Denable-debug=on ..`), a map file `libfluidsynth-<version>.wasm.map` is also generated.
    * Currently it seems that it cannot be used.
* If `enable-separate-wasm` specified on the `cmake` execution (e.g. `emcmake cmake -Denable-separate-wasm=on ..`), `libfluidsynth-<version>.wasm` and `libfluidsynth-<version>.wast` are also generated.
    * For AudioWorklet, you cannot use `*.wasm` file directly.
* In Emscripten-build mode, standalone application named `fluidsynth` is not emitted.
* By default, if `libsndfile` and its dependencies (FLAC, ogg, vorbis, vorbisenc, opus) are found, the library will be bundled and corresponding features will be enabled. `-Denable-libsndfile=off` will disable the features.
    * `libsndfile` and the dependencies must be built with Emscripten and installed in the Emscripten sysroot (e.g. `path/to/emsdk/upstream/emscripten/cache/sysroot` ).

## Build static library for Emscripten

Please specify `-D BUILD_SHARED_LIBS=off` on calling emcmake. (e.g. `emcmake cmake -D BUILD_SHARED_LIBS=off ..`)

In this mode, you can also build sources under `doc` directory (e.g. `cd build/doc && make fluidsynth_simple -j16`), although all exportable functions will be exported.

## Usage

Place `libfluidsynth-<version>.js` file to your space and load `libfluidsynth-<version>.js`. After load, almost all FluidSynth API functions are accessible via `Module` object (note that all function names have the prefix `_`).

To use `libfluidsynth-<version>.js` in AudioWorklet, load it into AudioWorklet before your worklet JS file. In your worklet JS file, you can access `Module` object via `AudioWorkletGlobalScope.wasmModule`.

## Miscellaneous

* Currently only several APIs are tested. Some APIs such as for drivers may not work.

## License

This program and all source codes, including the original FluidSynth program, its source codes, modifications of FluidSynth source codes for building library with Emscripten, and sources codes used only for building `libfluidsynth-<version>.js`, are licensed under [GNU Lesser General Public License (v2.1)](./LICENSE) (LGPL v2.1).
