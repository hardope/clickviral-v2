FROM node:20

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]