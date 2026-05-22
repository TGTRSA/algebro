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

typedef struct IncrementData {
    char *level;
    size_t val;
}IncrementData;

void route(const char *req);

#endif