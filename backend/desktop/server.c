// The server will only i think for now handle json data:
// Folder 1:  ../assets/quesitons/{topic}/{level}/{level}/{subtopic}
// Folder 2: ../assets/progress/{topic}
// The structure for this data will be /operaiton$level


#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include "parser.h"


#define PORT 8888

void log_connection(const char *method, const char *url, const char *ip) {
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    printf("[%02d:%02d:%02d] CONNECTION | %s | %s | IP: %s\n", 
           t->tm_hour, t->tm_min, t->tm_sec, method, url, ip);
}

enum MHD_Result handle_request(void *cls, struct MHD_Connection *connection,
                                const char *url, const char *method,
                                const char *version, const char *upload_data,
                                size_t *upload_data_size, void **con_cls) {
    
    // Get client IP
    const union MHD_ConnectionInfo *info = MHD_get_connection_info(
        connection, MHD_CONNECTION_INFO_CLIENT_ADDRESS);
    char ip[INET_ADDRSTRLEN] = "unknown";
    
    if (info && info->client_addr && info->client_addr->sa_family == AF_INET) {
        struct sockaddr_in *addr = (struct sockaddr_in*)info->client_addr;
        inet_ntop(AF_INET, &(addr->sin_addr), ip, sizeof(ip));
    }
    
    log_connection(method, url, ip);
    
    route(url);

    // Response
    const char *response_msg = "HELLO FROM MHD\n";
    struct MHD_Response *response = MHD_create_response_from_buffer(
        strlen(response_msg), (void*)response_msg, MHD_RESPMEM_PERSISTENT);
    
    int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
    MHD_destroy_response(response);
    
    return ret;
}

int main() {
    printf("\n=== MHD Backend Server ===\n");
    printf("Port: %d\n", PORT);
    printf("Waiting for connections...\n\n");
    
    struct MHD_Daemon *mhd_daemon = MHD_start_daemon(
        MHD_USE_AUTO | MHD_USE_INTERNAL_POLLING_THREAD,
        PORT, NULL, NULL,
        &handle_request, NULL,
        MHD_OPTION_END);
    
    if (!mhd_daemon) {
        printf("Failed to start server\n");
        return 1;
    }
    
    getchar(); // Press Enter to stop
    
    MHD_stop_daemon(mhd_daemon);
    printf("\nServer stopped\n");
    return 0;
}