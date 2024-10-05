# Stage 1: Build the React app
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built app using a lightweight web server
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]