# Use offial Node.js image
FROM node:18-alpine as builder

# Create work directory in /root/src
RUN mkdir -p /root/src

# Establish the work directory in /root/src
WORKDIR /root/src

# Install only production deps
COPY ["package.json", "package-lock.json","./"] 
RUN npm install --only=production

# Copy the rest of the app files
COPY src/. ./

# Expose the port your app listens on
EXPOSE 3000

# Launch the app with your "start" script
CMD ["node", "index.js"]