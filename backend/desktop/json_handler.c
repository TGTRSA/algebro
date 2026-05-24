#include "json_handler.h"
#include <json-c/json.h>
#include <json-c/json_object.h>
#include <json-c/json_object_iterator.h>
#include <stdio.h>
#include <stdlib.h>
#include "stdbool.h"

void write_finished(const char* f, const char* subtopic, size_t index) {
    printf("\t[DEBUG]subtopic (%s) index(%zu)\n", subtopic, index);
    // Read file
    FILE *fp = fopen(f, "r");
    if(!fp){
        fprintf(stderr, "Failed to open file!\n");
        exit(-1);
    }

    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    char *json_string = malloc(size+1);
    fread(json_string, 1, size, fp);
    json_string[size] ='\0';
    fclose(fp);

    struct json_object *root = json_tokener_parse(json_string);
    free(json_string);
    struct json_object *value;
    if(!root){fprintf(stderr,"Failed to parser\n");exit(-1);}
    // json_object_get_boolean(root);
    json_object_object_get_ex(root,subtopic,&value);
    json_object_get_boolean(value);
    // bool answered = true;
    if(value==false){
        printf("Question not answered\n");
    }else {
        printf("Question answered\n");
    }

}
// for incrementing progress we need a route(f), level, and whether correct or incorrect
void increment_prog(const char *f, const char* level, size_t id) {
    printf("\t[DEBUG]level(%s) value(%zu)\n", level, id);
        // 1. Read file
    FILE *fp = fopen(f, "r");
    if (!fp) {
        printf("Failed to open file\n");
        exit(-1);
    }
    
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    
    char *json_string = malloc(size + 1);
    fread(json_string, 1, size, fp);
    json_string[size] = '\0';
    fclose(fp);  // Close once
    
    // 2. Parse
    struct json_object *root = json_tokener_parse(json_string);
    free(json_string);  // Free the string buffer
    
    if (!root) {
        printf("Failed to parse JSON\n");
        exit(-1);
    }
    
    // 3. Modify values
    struct json_object *difficulty;
    json_object_object_get_ex(root, level, &difficulty);
    
    if (id > 1) {
        printf("Invalid parameter in increment prog: id (%zu)\n", id);
        exit(1);
    }
    
    // Get the correct object and modify it
    const char *key = (id == 0) ? "incorrect" : "correct";
    struct json_object *counter;
    json_object_object_get_ex(difficulty, key, &counter);
    
    int old_val = json_object_get_int(counter);
    int new_val = old_val + 1;
    json_object_set_int(counter, new_val);  // ACTUALLY MODIFY IT
    
    printf("[DEBUG]Previous value: %d\n[DEBUG]Current val: %d\n", old_val, new_val);
    
    // 4. Write back
    json_object_to_file_ext(f, root, JSON_C_TO_STRING_PRETTY);
    
    // 5. Clean up
    json_object_put(root);
}