# Dockerfile
FROM node:20

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# COPY
COPY . .

# Install app dependencies
RUN npm install

# define port
EXPOSE 80/tcp

# Start the server using the production build
CMD [ "npm run start" ]
