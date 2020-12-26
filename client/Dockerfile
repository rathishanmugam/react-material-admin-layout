## Create image based on the official Node 10 image from dockerhub
#FROM node:10
## Create a directory where our app will be placed
#RUN mkdir -p /app
## Change directory so that our commands run inside this new directory
#WORKDIR /app
## Copy dependency definitions
#COPY . /app/
##COPY backend /app/backend/
##COPY src /app/src/
##COPY public /app/public/
## Install dependecies
#RUN npm install
#RUN yarn
## Get all the code needed to run the app
#RUN pwd
#RUN ls
#RUN ls backend
## Expose the port the app runs in
#EXPOSE 3000
## Serve the app
#ENTRYPOINT ["npm", "start"]



# Create image based on the official Node 10 image from dockerhub
FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY backend /app/backend/
COPY src /app/src/
COPY public /app/public/
COPY env.sh /app/

#COPY build env.js env.js.sh ./
RUN pwd
RUN ls
RUN chmod +x env.sh
# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ./env.sh "$API_KEY" && npm start

