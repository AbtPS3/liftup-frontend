# UCS Lift-Up Uploader Frontend

## Installation

1. Clone this project to your PC through `git clone https://github.com/AbtPS3/ucs-liftup-uploader-frontend.git`.

2. Navigate inside the cloned directory ` cd ./ucs-liftup-uploader-frontend`.

3. Copy example.env to a new file called .env and change all credentials as needed.

4. Build the project using `npm run build`

5. Create a folder in /var/www/html called ucs-liftup-uploader-frontend by using `mkdir -p /var/www/html/ucs-liftup-uploader-frontend`.

6. Create a symbolic link to the dist folder by using the command `ln -s ./dist /var/www/html/ucs-liftup-uploader-frontend/`.

## Configure Nginx

Configure your Nginx conf to point requests to localhost port 8082 to this folder in /var/ and create relevant proxy-pass to the backend server port if hosted on the same server.

## License

ISC

## Author

MOH, PS3+, NACP

## Version

1.0.1
