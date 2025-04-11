#!/bin/sh
set -e

# Remove server.pid for Rails if it exists
rm -f /rails/tmp/pids/server.pid

# Execute the command passed to the container
exec "$@"
