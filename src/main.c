// Minimal raylib starter template for FractalTree project.
#include "raylib.h"
#include <math.h>

#define WIDTH 600
#define HEIGHT 800

#define BRANCH_COLOR RAYWHITE
#define BACKGROUND_COLOR BLACK

#define ang(x) x*DEG2RAD // convert angle to radians

void DrawBrach(float x, float y, float length, float angle, float thickness);

int main(void){

    InitWindow(WIDTH, HEIGHT, "Fractal Tree");
    SetTargetFPS(60);

    while (!WindowShouldClose()) {
        BeginDrawing();
            ClearBackground(BACKGROUND_COLOR);
            DrawBrach(WIDTH/2, HEIGHT-100, 100, ang(0), 15);
        EndDrawing();
    }

    CloseWindow();
    return 0;
}

void DrawBrach(float x, float y, float length, float angle, float thickness){
    if(thickness*50 < 1) return;
    Vector2 start = {x, y};
    float xend = x + length * sin(angle);
    float yend = y - length * cos(angle);
    Vector2 end = {xend, yend};
    DrawLineEx(start, end, thickness, BRANCH_COLOR);
    DrawBrach(xend, yend, length*0.75, angle + ang(25), thickness*0.75);
    DrawBrach(xend, yend, length*0.75, angle - ang(25), thickness*0.75);
}