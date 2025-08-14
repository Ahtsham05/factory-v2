#!/bin/bash

# Factory Management App Setup Script
# This script ensures everything is ready for single-click launch

echo "🏭 Factory Management App Setup"
echo "================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check Node.js
echo -e "${BLUE}Checking prerequisites...${NC}"
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm installed: v${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    echo "Please install npm with Node.js"
    exit 1
fi

# Check Python for GUI launcher
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python3 installed: ${PYTHON_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  Python3 not found - GUI launcher won't work${NC}"
    echo "Install Python3 for the GUI launcher feature"
fi

# Check MongoDB
if command_exists mongod; then
    echo -e "${GREEN}✅ MongoDB installed${NC}"
elif command_exists mongo; then
    echo -e "${GREEN}✅ MongoDB client found${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found${NC}"
    echo "Install MongoDB from https://www.mongodb.com/try/download/community"
fi

echo
echo -e "${BLUE}Installing dependencies...${NC}"

# Install root dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
    print_status $? "Root dependencies installed"
else
    echo -e "${GREEN}✅ Root dependencies already installed${NC}"
fi

# Install client dependencies
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
    print_status $? "Client dependencies installed"
else
    echo -e "${GREEN}✅ Client dependencies already installed${NC}"
fi

# Install server dependencies
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
    print_status $? "Server dependencies installed"
else
    echo -e "${GREEN}✅ Server dependencies already installed${NC}"
fi

# Make scripts executable
echo
echo -e "${BLUE}Setting up launch scripts...${NC}"
chmod +x start-app.sh
chmod +x launcher.py
chmod +x Factory-App.desktop
echo -e "${GREEN}✅ Launch scripts are ready${NC}"

# Test build
echo
echo -e "${BLUE}Testing build process...${NC}"
cd client && npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Client build successful${NC}"
else
    echo -e "${YELLOW}⚠️  Client build had issues - check manually${NC}"
fi
cd ..

echo
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo
echo -e "${BLUE}Launch Options:${NC}"
echo "1. GUI Launcher:    python3 launcher.py"
echo "2. Shell Script:    ./start-app.sh"
echo "3. Manual:          npm run dev"
echo
echo -e "${BLUE}Application URLs (when running):${NC}"
echo "• Frontend: http://localhost:5173"
echo "• Backend:  http://localhost:3000"
echo
echo -e "${YELLOW}Note: Voice-to-text will work in supported browsers${NC}"
echo -e "${YELLOW}Grant microphone permissions when prompted${NC}"
