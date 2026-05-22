// each portion of the url shuold be thought to be separated by /
// finished/topic=u/level=x/subtopic=y/index=z
//  where index is which question to mark as complete
// inc_prog/level=x/technique=y/val=z 
// where val is whether to increment cirrect or incorrect
#include "parser.h"
#include "json_handler.h"

#include <inttypes.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const char* questions_dir = "../assets/questions/";
const char* progress_dir = "../../assets/progress/expansion.json"; 
const char* base_progress_dir = "../../assets/progress/"; 

char* compile_prog_dir(char* technique) {
    char* ext=".json";
    size_t len_filename = strlen(technique ) +strlen(ext);
    char *filename = malloc( len_filename+1);
    // starting filename name
    strcpy(filename,technique);
    // adding extension 
    strcat(filename,ext);
    filename[len_filename]= '\0';
    size_t len_dir = strlen(filename)+strlen(base_progress_dir);
    char *dir = malloc(+1);
    dir[len_dir]='\0';
    return dir;
}

struct CompletedQuestion complete_question(char *req, size_t initial_bang_pos,size_t len_url) {
    question data;

      
    return data;
}

// url looks like: inc_prog/level=x/val=
IncrementData parse_inc(const char *increment_instruction, const size_t initial_bang_pos, size_t len_url) {
    size_t i, j, equalsign, value;
    char c;
    char *endptr;
    errno=0;
    IncrementData data;
    size_t bang_indx=initial_bang_pos + 1;
    for(i=bang_indx;i<len_url;i++){
        printf("[DEBUG]Char: %c\n", increment_instruction[i]);
        if (increment_instruction[i]=='='){
            equalsign = i;
        }
        if (increment_instruction[i]=='!' || i==len_url-1) {
            // beginning of bang
            size_t i_indx = bang_indx;
            char *instruction = (char *)malloc((equalsign-bang_indx)+1);
            printf("\t[DEBUG]Len instruction buffer: %zu\n",equalsign-bang_indx);
            j=0;
            // going from just ahead of 1st bang to 
            while(i_indx<equalsign){
                instruction[j]=increment_instruction[i_indx];
                i_indx++;
                j++;
            }
            instruction[equalsign-bang_indx]='\0';
            printf("\t[DEBUG]Instruction: %s\n",instruction);
            printf("\t[DEBUG]i(%zu)-equalsign(%zu)\n", i,equalsign); 
            char *b;   
            // compiling value manually
            if(i==len_url-1){
                data.val = strtoull(&increment_instruction[equalsign+1], &endptr, 10);
                break;
            }else{
                b = (char *)malloc(sizeof(char) * (i-equalsign)+1);
            }
            printf("\t[DEBUG]Length of data buffer: %zu plus null(%zu)\n",i-equalsign, i-equalsign+1);        
            j=0;
            // dealing with individual cases
            if(strcmp("level",instruction)==0){
                size_t start = equalsign+1;
                j = 0;
                while(start < i){
                    b[j] = increment_instruction[start];
                    j++;
                    start++;
                }
                b[j] = '\0';  // USE j, NOT i-equalsign
                
                data.level = malloc(strlen(b) + 1);
                strcpy(data.level, b);
                printf("\t[DEBUG]Level: %s\n", data.level);
            }else if (strcmp("technique",instruction)==0) {
                size_t start = equalsign+1;
                j = 0;
                while(start < i){
                    b[j] = increment_instruction[start];
                    j++;
                    start++;
                }
                b[j] = '\0';  // USE j, NOT i-equalsign
                
                data.technique = malloc(strlen(b) + 1);
                strcpy(data.level, b);
                printf("\t[DEBUG]Level: %s\n", data.level);
            }else{
                printf("Invalid instruction in inc_prog\n");
                exit(-1);
            }
            free(b);
            free(instruction);
            bang_indx=i+1;
        }

    }
    printf("\t[DEBUG]Level: %s\nIncrement: %zu\n", data.level, data.val);
    return data;    
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
    command[len_req] = '\0';
    printf("URL: %s\n", req);
    printf("Thing meant to be done: %s\n", command);
    if(strcmp(command,"inc_prog")==0){
        printf("Incremenenting progress...\n");
        IncrementData d = parse_inc(req, c_indx, len_req);
        char* dir = compile_prog_dir(d.technique);
        increment_prog(progress_dir, d.level,d.val);
        free(d.level);
        // increment_prog(progress_dir, "basic",0);
    }else if (strcmp(command,"finished")==0) {
        ;
    }
    free(command);
}