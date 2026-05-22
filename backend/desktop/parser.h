#ifndef PARSER
#define PARSER
// #include <cstddef>
#include <sys/types.h>
#include <sys/ucontext.h>
#include "stddef.h"
#include "stdint.h"
#include "errno.h"
#include "stdlib.h"
#include "stdio.h"
#include "math.h"
#include "stdbool.h"
#include "json_handler.h"
#include "string.h"

#pragma once

// #include <cstdio>

typedef struct CompletedQuestion {
    char* level;
    char* subtopic;
    size_t indx;
}question;

typedef struct IncrementData {
    char* technique;
    char* level;
    size_t val;
}IncrementData;
char* compile_prog_dir(char* technique);

IncrementData parse_inc(const char *increment_instruction, const size_t initial_bang_pos, size_t len_url);

void route(const char *req);

#endif