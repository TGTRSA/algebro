// each portion of the url shuold be thought to be separated by !
// example: finished!level=x!subtopic=y!index=z
// example: inc_prog!subtopic=x and so on
#include "parser.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>



const char* questions_dir = "../assets/questions/";
const char* progress_dir = "../assets/progress/expansion.json"; 

void route(const char* req){
    size_t len_req = strlen(req);
    size_t buf_indx = 0;
    size_t c_indx = 1;
    char* command = malloc(sizeof(char) * (len_req + 1));
    printf("[DEBUG] Length of request:  %zu\n", len_req);
    while(req[c_indx]!='!'){
        command[buf_indx] = req[c_indx];
        buf_indx++;
        c_indx++;
        if(c_indx==len_req-1){
            printf("Routing error: separator never found");
            exit(-1);
        }
    }
        command[len_req] = '\0';
    printf("URL: %s\n", req);
    printf("Thing meant to be done: %s\n", command);
    if(strcmp(command,"inc_prog")==0){
        printf("Incremenenting progress...\n");
        increment_prog(progress_dir, "basic",1);
        
    }else if (strcmp(command,"finished")==0) {
        ;
    }
    free(command);
}