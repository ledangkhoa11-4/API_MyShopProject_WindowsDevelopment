# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./
COPY index.js ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./config ./config
COPY ./model ./model
COPY ./Routes ./Routes


# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm i 
   

EXPOSE 5000

# Start the app using serve command
CMD [ "npm", "run", "dev" ]