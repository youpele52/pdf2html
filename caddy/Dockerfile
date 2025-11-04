# Caddy production image
FROM caddy:alpine

# Copy Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
