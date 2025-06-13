# Use offial Node.js image
FROM node:18-alpine as builder

# Create work directory in /root/src
RUN mkdir -p /root/src

# Establish the work directory in /root/src
WORKDIR /root/src

# Copy dependencies files (for better cashing)
COPY ["package.json", "package-lock.json","./"] 

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . ./

# Start the app
CMD ["npm", "run", "dev"]