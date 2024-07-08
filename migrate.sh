#!/bin/sh

# Run database migrations
npx prisma migrate dev --name init 
npx prisma db seed
# Run the main container command
exec "$@"
