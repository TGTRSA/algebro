# Math Learning App (Core Framework)

A cross-platform React Native / Expo mathematics learning application featuring an offline-first architecture powered by a local, C-based routing and metrics backend.

---

## 📁 Repository Structure

### Top-Level Directory
```text
.
├── android/                   # Native Android build and configuration files
├── app/                       # Main Expo Router application directory (Screens & Routing)
├── app-example/               # Example app code or boilerplate reference
├── assets/                    # Static app assets and local JSON storage
│   ├── backend/               # Local C-backend assets (Legacy/Backup path)
│   ├── progress/              # User progress metric files ([subtopic].json)
│   └── questions/             # Mathematics question bank ([topic]/[level]/[subtopic])
├── backend/                   # Local native C-server runtime and API sources
│   ├── android/               # Android-specific JNI/Native backend glue
│   ├── desktop/               # Desktop environment backend (Testing / Native run)
│   ├── ios/                   # iOS-specific Objective-C/Native backend bridge
│   └── docs/                  # Low-level backend engine documentation
├── scripts/                   # Custom build or automation scripts
├── styles/                    # Global React Native stylesheets and layouts
├── app.json                   # Expo configuration file
├── eas.json                   # Expo Application Services configuration
├── start-dev.js               # Custom development server startup script
└── tsconfig.json              # TypeScript configuration
```

---

## 📐 Data & Question Architecture

The application relies on a structured JSON question bank located in `assets/questions/[topic]/[level]/[subtopic]`.

### 1. Topics & Subtopics
Topics represent core mathematical modules. These break down into specific operational categories:
*   **Algebra:** Exponents, Terms, Polynomials, Factoring
*   **Calculus:** Derivation, Integration, Limits
*   **Other Modules:** Trigonometry, Analytical Geometry, etc.

### 2. Pedagogical Techniques
Questions are systematically tagged by **Techniques** rather than raw formula types. This isolates core conceptual objectives to assess and build cognitive skillsets:
*   **Simplification:** Reducing complex expressions.
*   **Expansion:** Multiplying out and developing mathematical terms.
*   **Manipulation:** Rearranging and rewriting equations logically.

*Goal: To map out the user's analytical problem-solving, critical thinking, lexical understanding of mathematics, and logic development.*

---

## ⚙️ Progress Tracking System

User proficiency metrics are updated mathematically. Milestones and difficulty thresholds are determined by **performance per individual technique**, not by generic subtopic completion. Metrics populate local tracking files inside `assets/progress/[subtopic].json`.

### Progress Schema Configuration
```json
{
  "basic": {"correct": 5, "incorrect": 2},
  "advanced": {"correct": 3, "incorrect": 4}
}
```

---

## 🚀 Native C-Backend Router Engine

A ultra-lightweight C-based URL routing system acts as the underlying API layer. It parses HTTP-like URL paths to track progression and increment performance metrics directly to disk.

### 1. URL Architecture

#### Complete Question Route
Notifies the engine that a client has selected or finalized a question index inside a specific package.
```text
/finished/topic={topic}/level={level}/subtopic={subtopic}/val={index}
```
*   `topic`: Core category (e.g., `mathematics`).
*   `level`: Difficulty tier (e.g., `basic`, `intermediate`).
*   `subtopic`: Specific target subtopic folder.
*   `val`: 0-indexed question ID inside the target JSON file.

#### Increment Progress Route
Increments performance tallies across specific conceptual methodologies.
```text
/inc_prog/level={level}/technique={technique}/val={type}
```
*   `level`: Current difficulty level.
*   `technique`: Conceptual target (e.g., `simplification`, `manipulation`).
*   `val`: Outcome code (`0` = Incorrect, `1` = Correct).

### 2. Engine Routing Examples
```cpp
// Finalize a kinematics question index
route("/finished/topic=physics/level=intermediate/subtopic=kinematics/val=12");

// Register a successful technique solution
route("/inc_prog/level=intermediate/technique=problem_solving/val=1");

// Register a failed technique solution
route("/inc_prog/level=intermediate/technique=problem_solving/val=0");
```

### 3. Core Structural Data Models
```c
struct CompletedQuestion {
    char* level;
    char* topic;
    char* subtopic;
    size_t val;         // Question index
};

typedef struct {
    char* level;
    char* technique;
    size_t val;         // 0 = Incorrect, 1 = Correct
} IncrementData;
```

### 4. API Function Registry
*   `route(const char* req)`: Main gateway router. Parses the incoming route path and dispatches payload blocks to specific handlers.
*   `parse_inc()`: Extracts path arguments out of increment URLs. Maps values to an `IncrementData` object.
*   `complete_question()`: Extracts path arguments from completion routes. Maps values to a `CompletedQuestion` object.
*   `increment_prog(const char *f, const char* level, size_t id)`: Handles disk mutations. Updates local JSON counters with modern hit/miss status.
*   `write_data(char **d, size_t len_data, char* str_to_write)`: System safe helper to write string fragments dynamically into designated struct allocations.
*   `compile_prog_dir(char* technique)`: Formats and constructs active system file paths targeting technique-specific data files.

---

## 🛠 Compilation and Build Execution

To build the standalone native routing engine binary for local validation testing, execute `gcc` against the engine modules. Make sure your local workspace environment has `json-c` configured:

```bash
gcc -o url_router main.c parser.c json_handler.c -ljson-c
```
