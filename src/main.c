// Minimal raylib starter template for FractalTree project.
#include "raylib.h"

int main(void) {
    const int screenWidth = 1200;
    const int screenHeight = 900;

    InitWindow(screenWidth, screenHeight, "FractalTree - raylib template");
    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        BeginDrawing();
            ClearBackground(RED);

            DrawText("Raylib template - replace with fractal code", 20, 20, 20, RED);

            // Example placeholder: draw a simple circle at mouse position
            Vector2 mouse = GetMousePosition();
            DrawCircleV(mouse, 10.0f, MAROON);

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
