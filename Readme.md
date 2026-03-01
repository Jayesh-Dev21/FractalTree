FractalTree

![](./images/PB_FractalTree.png)

A small drawing and fractal-playground written in C and ported to raylib.

Purpose: personal exploration and small demos of fractal shapes and drawing tools.

Build & Run:

```sh
make
./bin/fractal_canopy
```

These ASCII lines are a small, static demonstration of a recursive / self-similar
pattern (inspired by Sierpinski-like branching). Replace this with live rendering
in `src/main.c` to produce interactive fractal visuals.

Notes:
- This repo was updated to use raylib and a pkg-config driven Makefile.
- Ensure `raylib` and `pkg-config` are installed on your system before building.