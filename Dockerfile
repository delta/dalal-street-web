FROM nginx:latest

RUN apt-get update && \
    apt-get install -y apt-utils \
    curl \
    git \
    vim \
    wget \
    unzip \
    gnupg

WORKDIR /

COPY frontend-node-install.sh .

RUN bash frontend-node-install.sh

ENV PATH /var/www/dalalstreet/protobuf/bin:/node-v10.17.0-linux-x64/bin:$PATH

RUN mkdir -p /var/www/dalalstreet

WORKDIR /var/www/dalalstreet

COPY . .

CMD ["./docker-web-entry.sh"]
