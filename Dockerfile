# Use the official Node.js 18 image as a base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to utilize cached Docker layers
COPY package*.json ./

# Install npm dependencies (including devDependencies for building the project)
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the SvelteKit app for production
RUN npm run build

# Production stage
FROM node:18 AS production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing production dependencies
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the built app from the build container
COPY --from=build /usr/src/app/build ./build

EXPOSE 3000

# Start the Node.js server
CMD ["node", "build"]