FROM nginx:stable-alpine

# Remove default config and copy our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/qmoi-static.conf

# Copy static assets
COPY ../../public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
