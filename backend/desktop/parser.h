#ifndef PARSER
#define PARSER
// #include <cstddef>
#include <sys/types.h>
#include "stddef.h"
#include "stdint.h"
#include "stdlib.h"
#include "stdio.h"
#include "math.h"
#include "stdbool.h"
#include "json_handler.h"
#include "string.h"
#pragma once

// #include <cstdio>


#define GREEN "\x1b[33m"
#define RESET "\x1b[0m"

void route(const char *req);

#endif