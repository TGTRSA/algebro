// each portion of the url shuold be thought to be separated by !
// example: finished!level=x!subtopic=y!index=z
// example: inc_prog!subtopic=x and so on
#include "parser.h"

#include <inttypes.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>



const char* questions_dir = "../assets/questions/";
const char* progress_dir = "../../assets/progress/expansion.json"; 

// url looks like: increment!level=x!val=
void increment_parser(const char *increment_instruction, const size_t initial_bang_pos, size_t len_url) {
    size_t i, j, pos;
    char c;
    char *endptr;
    errno=0;
    IncrementData data;
    for(i=initial_bang_pos;i<len_url;i++){
        printf("[DEBUG]Char: %c\n", increment_instruction[i]);
        if (increment_instruction[i]=='!') {
            pos = initial_bang_pos;
            j=0;
            while(pos<i){
                pos++;
                if(increment_instruction[pos]=='='){
                    break;
                }
            }
            printf("\t[DEBUG]pos: %zu(%c) i: %zu(%c)\n", pos, increment_instruction[pos], i, increment_instruction[i]);
            // because currently pos includes = we can assume this is space for null
            char *b= malloc(sizeof(char) * (i-pos));
            printf("\t[DEBUG] pos: %zu(%c)", pos, increment_instruction[pos]);
            pos++;
            while(pos<i){
                if (increment_instruction[pos]=='!'||pos==i) {
                    if(strcmp("level", b)==0){
                        b[i-len_url]='\0';
                        data.level = b;
                    }else{
                        b[i-len_url]='\0';
                        data.val = strtoumax(b, &endptr, 10);
                        if(errno==ERANGE){
                            printf("Error in str to size_t convertion\n");
                            exit(1);
                        }else if (endptr==b) {
                            printf("Error in str convertion\n");
                            exit(1);
                        }
                    }
                    break;
                }
                b[j]=increment_instruction[pos];
                printf("[DEBUG]c: %c\n", increment_instruction[pos]);
                pos++;
                j++;
            }
        }
    }
    printf("\t[DEBUG]Level: %s\nIncrement: %zu\n", data.level, data.val);
    increment_prog(progress_dir, data.level,data.val);
}

void route(const char* req){
    size_t len_req = strlen(req);
    size_t buf_indx = 0;
    size_t c_indx = 1;
    char* command = malloc(sizeof(char) * (len_req + 1));
    printf("[DEBUG] Length of request:  %zu\n", len_req);
    
    // This returns only the inital command => routing
    while(req[c_indx]!='!' && c_indx < len_req){
        command[buf_indx] = req[c_indx];
        buf_indx++;
        c_indx++;
        // if(c_indx==len_req-1){
        //     printf("Routing error: separator never found");
        //     exit(-1);
        // }
    }
    c_indx++;
    command[len_req] = '\0';
    printf("URL: %s\n", req);
    printf("Thing meant to be done: %s\n", command);
    if(strcmp(command,"inc_prog")==0){
        printf("Incremenenting progress...\n");
        increment_parser(req, c_indx, len_req);
    }else if (strcmp(command,"finished")==0) {
        ;
    }
    free(command);
}