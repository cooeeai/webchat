# webchat

Web chat module for Cooee.ai. Chat application using React, Redux and Firebase.

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
