# URL Router for Question Progress Tracking

A C-based URL routing system that parses HTTP-like URL paths to track user progress through questions and increment performance metrics.

## URL Structure

### Complete Question Route
`/finished/topic={topic}/level={level}/subtopic={subtopic}/val={index}`

- `topic`: Topic category (e.g., "mathematics")
- `level`: Difficulty level (e.g., "basic")
- `subtopic`: Specific subtopic
- `val`: Question index in JSON file (0-based)

### Increment Progress Route
`/inc_prog/level={level}/technique={technique}/val={type}`

- `level`: Difficulty level
- `technique`: Technique/question category
- `val`: 0 = incorrect, 1 = correct

## Project Structure
# Project Structure

```text
.
├── android/                   # Native Android build and configuration files
├── app/                       # Main Expo Router application directory
├── app-example/               # Example app code or boilerplate reference
├── assets/                    # Static assets like images, icons, and fonts
├── backend/                   # Server-side logic and API source
├── node_modules/              # Project dependencies 
├── scripts/                   # Custom build or automation scripts
├── styles/                    # Global stylesheets and layout styling
├── app.json                   # Expo configuration file
├── eas.json                   # Expo Application Services configuration
├── eslint.config.js           # Linting rules configuration
├── expo-env.d.ts              # TypeScript definitions for Expo
├── package.json               # Project manifest and scripts
├── package-lock.json          # Dependency lockfile
├── readme.md                  # Project Base Explanation 
├── README.md                  # Main project documentation
├── start-dev.js               # Custom development server startup script
├── tsconfig.json              # TypeScript configuration
└── [Development Artifacts]    # Temporary files (my-staged-changes.patch, todo.txt, etc.)
```


## Directory Structure
```text

.
├── backend/            # Server-side logic and API source
│   ├── android/        # Android-specific backend code
│   ├── desktop/        # Desktop-specific backend code
│   ├── docs/           # Documentation
│   ├── ios/            # iOS-specific backend code
│   └── README.md       # Backend documentation
```


## Core Functions

**`route(const char* req)`** - Main router that parses URL and dispatches to handlers

**`parse_inc()`** - Parses increment URLs, returns `IncrementData` (level, technique, val)

**`complete_question()`** - Parses completed question URLs, returns `question` (topic, level, subtopic, val)

**`increment_prog(const char *f, const char* level, size_t id)`** - Updates JSON file with new correct/incorrect counts

**`write_data(char **d, size_t len_data, char* str_to_write)`** - Writes string data to struct fields

**`compile_prog_dir(char* technique)`** - Constructs file path for technique-specific progress files

## Data Structures

```c
struct CompletedQuestion {
    char* level;
    char* topic;
    char* subtopic;
    size_t val;  // Question index
};

typedef struct {
    char* level;
    char* technique;
    size_t val;  // 0=incorrect, 1=correct
} IncrementData;

{
  "basic": {"correct": 5, "incorrect": 2},
  "advanced": {"correct": 3, "incorrect": 4}
}
```

## Examples: 
``` cpp
route("/finished/topic=physics/level=intermediate/subtopic=kinematics/val=12");
route("/inc_prog/level=intermediate/technique=problem_solving/val=1");  // correct
route("/inc_prog/level=intermediate/technique=problem_solving/val=0");  // incorrect
```
# Build
gcc -o url_router main.c parser.c json_handler.c -ljson-c