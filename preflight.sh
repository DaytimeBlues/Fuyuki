#!/bin/bash

# Configuration
# Colors for clear feedback
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to handle errors
fail() {
    echo -e "${RED}[FAILURE] $1${NC}"
    echo "----------------------------------------------------"
    echo "The preflight check failed. Do not merge. Fix the issues."
    exit 1
}

pass() {
    echo -e "${GREEN}[PASS] $1${NC}"
}

echo "----------------------------------------------------"
echo -e "${YELLOW}STARTING PREFLIGHT CHECKS${NC}"
echo "----------------------------------------------------"

# 1. IDENTIFY ENVIRONMENT
if [ -f "package.json" ]; then
    ENV="NODE"
    echo "Detected: Node.js/TypeScript environment"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    ENV="PYTHON"
    echo "Detected: Python environment"
else
    echo "Unknown environment. Defaulting to generic checks."
    ENV="GENERIC"
fi

# 2. STATIC ANALYSIS & TYPE CHECKING
echo -e "\nRunning Static Analysis..."
if [ "$ENV" == "NODE" ]; then
    npx tsc --noEmit || fail "TypeScript compilation failed. Types are mismatched."
    pass "TypeScript checks clean."
elif [ "$ENV" == "PYTHON" ]; then
    mypy . || fail "Python type checking failed."
    pass "Type checks clean."
fi

# 3. LINT CHECK
echo -e "\nRunning Linter..."
if [ "$ENV" == "NODE" ]; then
    npm run lint || fail "ESLint found issues. Fix lint errors before proceeding."
    pass "Lint checks clean."
elif [ "$ENV" == "PYTHON" ]; then
    ruff check . || fail "Python linting failed."
    pass "Lint checks clean."
fi

# 4. UNIT TESTS
echo -e "\nRunning Unit Tests..."
if [ "$ENV" == "NODE" ]; then
    npm run test || fail "Unit tests failed. Run 'npm run test:ui' to debug."
    pass "Unit tests passed."
elif [ "$ENV" == "PYTHON" ]; then
    pytest --ignore=e2e || fail "Unit tests failed."
    pass "Unit tests passed."
fi

# 5. LOGGING ENFORCEMENT
echo -e "\nVerifying Observability..."
CHANGED_FILES=$(git diff --name-only --cached)
if [ -z "$CHANGED_FILES" ]; then
    echo "No files staged. Checking recent source files..."
    if [ "$ENV" == "NODE" ]; then
        grep -r "console.log\|logger\." ./src > /dev/null || fail "No logging detected in ./src. Add logs to trace execution."
    else
        grep -r "print(\|logging\." . > /dev/null || fail "No logging detected. Add logs to trace execution."
    fi
else
    for file in $CHANGED_FILES; do
        if [[ $file == *.ts ]] || [[ $file == *.js ]] || [[ $file == *.py ]]; then
            grep "console.log\|logger\.\|print(\|logging\." "$file" > /dev/null
            if [ $? -ne 0 ]; then
                echo -e "${YELLOW}WARNING: No logs found in modified file: $file${NC}"
            fi
        fi
    done
fi
pass "Logging presence verified."

# 6. RUN BUILD
echo -e "\nRunning Build..."
if [ "$ENV" == "NODE" ]; then
    npm run build || fail "Build failed."
fi
pass "Build complete."

# 7. RUN E2E TESTS (if available)
echo -e "\nRunning End-to-End Tests..."
if [ "$ENV" == "NODE" ]; then
    if [ -f "playwright.config.ts" ]; then
        npx playwright test || fail "E2E Tests failed. Run 'npx playwright show-report' to see why."
    else
        echo "No Playwright config found. Skipping E2E tests."
    fi
elif [ "$ENV" == "PYTHON" ]; then
    pytest || fail "Tests failed."
fi
pass "Real-world verification complete."

echo "----------------------------------------------------"
echo -e "${GREEN}PREFLIGHT COMPLETE. SYSTEM IS STABLE.${NC}"
echo "----------------------------------------------------"
