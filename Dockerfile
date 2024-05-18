# Base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# RUN apt-get update -y && apt-get install -y openssl
# Copy the .env and .env.development files
# COPY .env .env.development ./

# Creates a "dist" folder with the production build
RUN npx prisma generate dev
RUN npm run build

# Expose the port on which the app will run
EXPOSE 8080

# Start the server using the development build
CMD ["npm", "run", "start:prod"]
