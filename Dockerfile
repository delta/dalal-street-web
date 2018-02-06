FROM nginx:latest

RUN apt-get update && \
    apt-get install -y apt-utils \
    curl \
    git \
    vim \
    wget \
    unzip \
    gnupg && \
    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \
    apt-get install -y nodejs

WORKDIR /var/www/dalalstreet

CMD ["./docker-web-entry.sh"]
