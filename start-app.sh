#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}    Factory Management App Startup Script${NC}"
echo -e "${BLUE}===============================================${NC}"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo -e "${BLUE}Loading nvm...${NC}"
    source "$NVM_DIR/nvm.sh"
fi

if [ -s "$NVM_DIR/bash_completion" ]; then
    source "$NVM_DIR/bash_completion"
fi

# Source user's profile to get proper PATH
if [ -f "$HOME/.bashrc" ]; then
    source "$HOME/.bashrc"
fi

if [ -f "$HOME/.profile" ]; then
    source "$HOME/.profile"
fi

# Source our environment setup script
if [ -f "./setup-env.sh" ]; then
    echo -e "${BLUE}Loading Factory App environment...${NC}"
    source "./setup-env.sh"
fi

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    echo "Please install npm with Node.js"
    exit 1
fi

echo -e "${GREEN}Node.js and npm are installed. Starting application...${NC}"
echo

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${BLUE}Node.js version: ${NODE_VERSION}${NC}"

# Function to install dependencies if needed
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing root dependencies...${NC}"
        npm install
    fi

    if [ ! -d "client/node_modules" ]; then
        echo -e "${YELLOW}Installing client dependencies...${NC}"
        cd client && npm install && cd ..
    fi

    if [ ! -d "server/node_modules" ]; then
        echo -e "${YELLOW}Installing server dependencies...${NC}"
        cd server && npm install && cd ..
    fi
}

# Check if MongoDB is running (optional)
check_mongodb() {
    if command_exists mongod; then
        echo -e "${BLUE}Checking MongoDB...${NC}"
        # Add MongoDB connection check here if needed
    fi
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Trap to handle cleanup on script exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down application...${NC}"
    # Kill all background processes
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup INT TERM

# Install dependencies
install_dependencies

# Check MongoDB
check_mongodb

echo
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}    Starting Factory Management Application${NC}"
echo -e "${BLUE}===============================================${NC}"
echo
echo -e "${GREEN}Frontend (React): http://localhost:5173${NC}"
echo -e "${GREEN}Backend (Express): http://localhost:3000${NC}"
echo
echo -e "${YELLOW}Press Ctrl+C to stop the application${NC}"
echo

# Start the application
npm run dev

echo -e "\n${BLUE}Application stopped.${NC}"
