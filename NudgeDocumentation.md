# Nudge Documentation

## Introduction
This plugin allows users to create and manage "Nudges." A Nudge is an event notification with additional metadata like title, description, time, image cover, icon, and a one-line invitation message. This plugin provides API endpoints for creating and managing Nudges.

## Features
- User can tag an event to create a Nudge.
- Nudge includes a title, description, icon, and one-line invitation.
- Users can upload an image to use as a cover for the Nudge.
- Set a specific time for when the Nudge should be sent.

## Prerequisites
- Node.js
- NodeBB installed and running
- MongoDB and Redis installed and running
- Multer for handling file uploads

## Installation

1. **Clone the NodeBB Repository**:
    ```bash
    git clone -b v3.x https://github.com/NodeBB/NodeBB.git nodebb
    cd nodebb
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```
3. **Setup NodeBB**:
    NodeBB ships with a command line utility which allows for several functions. We'll first use it to setup NodeBB. This will install modules from npm and then enter the setup utilty.
    ```bash
    nodebb setup
    ```
4. **Create Plugin Skeleton**:
    ```bash
    ./nodebb plugin:write
    ```
    Follow the prompts to create the plugin, e.g., `nodebb-plugin-custom-nudge`.

5. **Install Multer**:
    ```bash
    npm install multer
    ```
## Data Model
```json
{
  "nudgeId": "string",            // Unique identifier for the nudge
  "event": "string",              // The event the nudge is about
  "title": "string",              // The title of the nudge
  "description": "string",        // The description of the nudge
  "time": "string",               // The time to send the nudge (ISO 8601 format)
  "invitation": "string",         // A one-line invitation message
  "icon": "string",               // Icon for the nudge
  "imageUrl": "string"            // URL of the uploaded image
}

```
## Plugin Code

### `library.js`
Create and update `library.js` to define the Nudge API:

```javascript
'use strict';

const db = require.main.require('./src/database');
const user = require.main.require('./src/user');
const winston = require.main.require('winston');
const multer = require('multer');
const path = require('path');

const controllers = {};

// Setup storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create a new nudge
controllers.createNudge = async function (req, res) {
  const { event, title, description, time, invitation, icon } = req.body;
  if (!event || !title || !time) {
    return res.status(400).json({ error: 'Event, title, and time are required' });
  }

  const file = req.file;
  const imageUrl = file ? '/uploads/' + file.filename : '';

  try {
    const nudgeId = await db.incrObjectField('nudge', 'nextId');
    await db.setObjectField('nudges:' + nudgeId, {
      event,
      title,
      description,
      time,
      invitation,
      icon,
      imageUrl
    });
    res.status(201).json({ message: 'Nudge created successfully', nudgeId });
  } catch (err) {
    winston.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = controllers;
```
# NodeBB Custom Nudge Plugin API Documentation

## Introduction
This API allows users to create and manage "Nudges" within a NodeBB forum. A Nudge is an event notification with additional metadata such as title, description, time, image cover, icon, and a one-line invitation message.

## Base URL
```bash
http://localhost:4567/api
```

## API Endpoints

### 1. Create Nudge
- **Endpoint**: `/nudges`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "event": "string",          // Required: The event the nudge is about
    "title": "string",          // Required: The title of the nudge
    "description": "string",    // Optional: The description of the nudge
    "time": "string",           // Required: The time to send the nudge (ISO 8601 format)
    "invitation": "string",     // Optional: A one-line invitation message
    "icon": "string",           // Optional: Icon for the nudge
    "image": "file"             // Optional: Upload an image as form-data
  }

- **Description:**
This endpoint creates a new nudge with the given details. The image should be uploaded as form-data.

### 2. Get Nudge
- Endpoint: /nudges/:nudgeId

- Method: GET

- Response:
```json
{
  "nudgeId": "string",
  "event": "string",
  "title": "string",
  "description": "string",
  "time": "string",
  "invitation": "string",
  "icon": "string",
  "imageUrl": "string"
}
```
- **Description:** This endpoint retrieves the details of a nudge by its ID.

### 3. Update Nudge
- Endpoint: /nudges/:nudgeId

- Method: PUT

- Payload:
```json
{
  "event": "string",          // Optional: The event the nudge is about
  "title": "string",          // Optional: The title of the nudge
  "description": "string",    // Optional: The description of the nudge
  "time": "string",           // Optional: The time to send the nudge (ISO 8601 format)
  "invitation": "string",     // Optional: A one-line invitation message
  "icon": "string",           // Optional: Icon for the nudge
  "image": "file"             // Optional: Upload an image as form-data
}
```
- **Description:** This endpoint updates the details of an existing nudge. The image should be uploaded as form-data.

### 4. Delete Nudge
- Endpoint: /nudges/:nudgeId

- Method: DELETE

- **Description**: This endpoint deletes a nudge by its ID.
