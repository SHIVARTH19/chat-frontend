# Chat Feature

## Overview

The Chat Feature is a real-time messaging interface for a React application. It allows users to log in using a nickname, view their message history, and start new chats with other users. The application checks for existing users based on their nickname and provides a seamless messaging experience.

## Features

- User login with nickname
- View and manage message threads
- Initiate new chats with other users
- Real-time message display
- User search and selection

## Prerequisites

- Node.js and npm installed
- A backend API to handle chat functionality (threads and messages)

## Installation

Follow these steps to set up and run the chat feature:

### 1. Clone the Repository

First, clone the repository to your local machine:

git clone <repository-url>
cd <repository-directory>

### 2. Install dependency

npm install

### 3. Start the Development Server

npm start

The application will be available at http://localhost:3000 by default.


## Usage

### Logging In

When the application starts, you'll be presented with the login page where you need to enter a nickname:

- **If the user exists**: The chat interface will load, showing the user's message history and threads.
- **If the user does not exist**: A new user will be created, and the chat interface will be initialized.

### Chat Interface

- **Threads List**: Displays all existing chat threads. Click on a thread to view the message history.
- **New Chat**: Click the "New Chat" button to open a modal where you can search for users and start a new chat.
  - **Search Users**: Enter a search query to find users. Select a user to initiate a chat.
- **Messages**: View and send messages in the selected thread. Messages you send appear on the right, while messages from others are shown on the left.
- **Logout**: Click the logout button to end your session and return to the login page.

### User Modal

- **Search Users**: Use the search input to find users by name.
- **Close Modal**: Click the close button or outside the modal area to close the user modal.

