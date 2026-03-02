CC := gcc
PKG_CONFIG := pkg-config

# Compiler flags: use pkg-config to pick up raylib flags on the host
CFLAGS := -Wall -lm -g $(shell $(PKG_CONFIG) --cflags raylib)
LDFLAGS := $(shell $(PKG_CONFIG) --libs raylib) -lm

SRC := src/main.c
OBJ := $(SRC:.c=.o)

TARGET := fractal_tree
BIN_DIR := bin
TARGET_PATH := $(BIN_DIR)/$(TARGET)

all: $(TARGET_PATH)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

$(TARGET_PATH): $(OBJ) | $(BIN_DIR)
	$(CC) $(OBJ) -o $(TARGET_PATH) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

.PHONY: clean all
clean:
	rm -f $(OBJ) $(TARGET_PATH)
	rm -rf $(BIN_DIR)