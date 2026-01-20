#!/bin/bash

# Fuyuki Finish Script - "The Vibe Coder's Automator"
# Automates the end-of-phase process: Preflight -> Commit -> Push

# Colors for feedback
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}--- Fuyuki Phase Completion ---${NC}"

# 1. Run Preflight Checks
echo -e "${YELLOW}[1/3] Running Preflight Checks...${NC}"
./preflight.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Preflight checks failed! Please fix the issues before finishing.${NC}"
    exit 1
fi

# 2. Stage and Commit
echo -e "${YELLOW}[2/3] Staging and Committing Changes...${NC}"
git add .

# Prompt for message if not provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Enter commit message (Semantic format: feat(ui): add glow):${NC}"
    read -r MESSAGE
else
    MESSAGE="$1"
fi

if [ -z "$MESSAGE" ]; then
    MESSAGE="chore: finish current phase"
fi

git commit -m "$MESSAGE"

# 3. Push to Master
echo -e "${YELLOW}[3/3] Pushing to master...${NC}"
git push origin master

if [ $? -eq 0 ]; then
    echo -e "${GREEN}--- Phase Complete: Master Updated & Deployment Triggered ---${NC}"
else
    echo -e "${RED}Push failed! Check your git credentials or connection.${NC}"
    exit 1
fi
