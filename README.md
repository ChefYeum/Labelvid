# Labelvid
Web based video labeller for Vision or whatever.

# How to run
1. Make sure (NPM)[https://nodejs.org/en/] is installed.
2. Open shell in the root directory of the project.
3. Run `npm install`.
4. Run `npm start`.
5. Open `https://localhost:8090` on your browser.

# Overview 
The web app allows you to process a video so that you can select a frame and annotate it by drawing polygons. The saving/editing feature is incomplete and so the backend server, though the backbone is implemented, does not do anything useful when running the app.

# Stack Choice
Unlike the mainstream fullstack approach, I did not use a frontend framework. This is because there is no (reliable) binding for Fabric JS, the canvas library I used to plot polygon over a frame. I used vanilla JavaScript along with Bootstrap as well as JQuery which was required by Bootstrap.

In terms of Dev tool, I used Parcel over Webpack given the scale of the project. I also used TypeScript to type-check during development as well as for compiling ES2015+ syntax down to CommonJS (This is usually done by Babel)

# What happened to your backend server?
I believe the challenge was to link the stored annotation to the respective frames of the video. This is especially difficult when the video was to be stored on the client side. If the videos were to be stored at server side, it would ideally need a file server to avoid storing the raw files directly on the database.
