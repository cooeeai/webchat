# webchat

Web chat module for Cooee.ai. Chat application using React, Redux and Firebase.

[Click here for Demo](https://webchat-6feb4.firebaseapp.com)

![screenshot](/assets/screenshot.png)

    git clone https://github.com/cooeeai/webchat
    cd webchat

Sign up for a [Firebase account](https://firebase.google.com/), and
[Create a New Project](https://console.firebase.google.com/).

Go to your application dashboard, click on Authentication in the side panel,
and enable the Twitter Sign-in Provider. (You will need Twitter account.)

From the Authentication panel, click on 'WEB SETUP' (top right). This will
reveal your API key and other connection details.

Copy `setenv.sh.template` to `setenv.sh`. Fill in the environment variables
from the above details. (You will need to modify the script if using Windows.)

Export the environment variables in your shell session. (These will be
  picked up by the build command below, and used to populate configuration
  variables in the app code. You should avoid committing this information
  to source control. `setenv.sh` as already been added to `.gitignore`.)

Install dependencies and start a local server for testing:

    npm install
    npm start

Open [http://localhost:7000/](http://localhost:7000/).

To add a channel, post:

    /add-channel my-channel-name

To remove a channel, post:

    /del-channel my-channel-name

To deploy the app to a hosted environment:

    npm install -g firebase-tools
    firebase login
    npm run-script deploy
    firebase init

    ? What Firebase CLI features do you want to setup for this folder?
    > Hosting: Configure and deploy Firebase Hosting sites

    ? What do you want to use as your public directory?
    > dist

    ? Configure as a single-page app (rewrite all urls to /index.html)?
    > Yes

    ? File dist/index.html already exists. Overwrite?
    > No

    firebase deploy
