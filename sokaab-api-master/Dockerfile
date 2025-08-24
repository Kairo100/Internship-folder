# FROM node:18-alpine as builder
# ARG DATABASE_URL=${DATABASE_URL}
# ARG PASSWORDSECRETHASH=${PASSWORDSECRETHASH}
# ARG JWT_SECRET=${JWT_SECRET}

# RUN apk update 
# RUN apk add --no-cache openssl1.1-compat


# # Set the working directory in the container

# WORKDIR /app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
# COPY prisma ./prisma/
# # Install app dependencies
# RUN npm install

# COPY . .

# RUN npm run build

# FROM node:18-alpine

# RUN apk update
# RUN apk add --no-cache openssl1.1-compat
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

# EXPOSE 3000
# CMD [ "npm", "run", "start:prod" ]


FROM node:18-alpine as builder

# Keep the same environment variable handling
ARG DATABASE_URL=${DATABASE_URL}
ARG PASSWORDSECRETHASH=${PASSWORDSECRETHASH}
ARG JWT_SECRET=${JWT_SECRET}

# Install OpenSSL and other required dependencies
RUN apk update && \
    apk add --no-cache \
    openssl \
    libc6-compat \
    openssl-dev \
    openssl-libs-static

# Install Python and build tools needed for some dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Use npm install instead of npm ci since we don't have package-lock.json
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production OpenSSL dependencies
RUN apk update && \
    apk add --no-cache \
    openssl \
    openssl-dev \
    openssl-libs-static

WORKDIR /app

# Copy package files and prisma files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/

# Use npm install for production dependencies
RUN npm install --only=production

# Copy built application and Prisma generated files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Start the application
CMD ["npm", "run", "start:prod"]