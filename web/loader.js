// Minimal diagnostic WASM loader. It tries to instantiate `index.wasm` and
// exposes a `Module` object on window so `index.html` can hook into Module.print.
// This loader provides helpful console output when the WASM fails to initialize.

(function(){
  const consoleEl = document.getElementById('console');
  function writeConsole(msg){
    if(consoleEl) consoleEl.textContent += msg + '\n';
    console.log(msg);
  }

  // Expose Module for the page (some pages expect a global Module)
  window.Module = window.Module || {};
  Module.print = Module.print || function(...args){ writeConsole(args.join(' ')); };
  Module.canvas = Module.canvas || document.getElementById('canvas');

  const wasmUrl = 'index.wasm';

  // Basic import object with common namespaces to improve chances of instantiation.
  const importObject = {
    env: {
      // Common helpers; presence here prevents immediate missing-import errors
      abort: function(){ writeConsole('WASM abort called'); },
      // Provide a small memory/table in case module expects it. If the wasm exports
      // its own memory/table, this will be ignored/overwritten by the runtime.
      memory: new WebAssembly.Memory({initial:256}),
      table: new WebAssembly.Table({initial:0, element: 'anyfunc'})
    },
    wasi_snapshot_preview1: {
      fd_write: function(){ /* no-op to satisfy some builds */ return 0; }
    }
  };

  async function instantiateWasm(){
    writeConsole('Loading ' + wasmUrl + ' ...');
    try{
      let result;
      if('instantiateStreaming' in WebAssembly && fetch){
        try{
          result = await WebAssembly.instantiateStreaming(fetch(wasmUrl), importObject);
        }catch(e){
          // instantiateStreaming can fail if the server doesn't serve wasm with proper MIME type
          writeConsole('instantiateStreaming failed: ' + e + '\nFalling back to ArrayBuffer instantiation.');
          const resp = await fetch(wasmUrl);
          const buf = await resp.arrayBuffer();
          result = await WebAssembly.instantiate(buf, importObject);
        }
      }else{
        const resp = await fetch(wasmUrl);
        const buf = await resp.arrayBuffer();
        result = await WebAssembly.instantiate(buf, importObject);
      }

      const instance = result.instance || result; // some hosts return the instance directly
      Module.instance = instance;
      writeConsole('WASM module instantiated. Exports: ' + Object.keys(instance.exports).join(', '));

      // If the module exported a _main or main, try calling it. Wrap in try/catch.
      if(instance.exports._main || instance.exports.main){
        try{
          writeConsole('Calling exported main function...');
          if(instance.exports._main) instance.exports._main(); else instance.exports.main();
          writeConsole('WASM main completed (no exception).');
        }catch(err){
          writeConsole('Calling main threw: ' + err);
          console.error(err);
        }
      } else {
        writeConsole('No main export found. Was this built with Emscripten (missing JS glue)?');
      }

    }catch(err){
      writeConsole('WASM instantiation failed: ' + err);
      console.error(err);
    }
  }

  // Start instantiation asynchronously
  instantiateWasm();

})();
