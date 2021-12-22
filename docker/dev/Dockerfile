FROM amazonlinux:2

RUN amazon-linux-extras enable php7.4 epel && yum clean metadata

RUN yum install -y unzip curl httpd php php-common php-pgsql php-curl php-gd php-mbstring php-xmlrpc php-intl php-zlib php-bcmath php-xml && \
  yum clean all && \
  rm -rf /var/cache/yum

COPY ./etc/httpd/conf.d/vhost.conf /etc/httpd/conf.d/web.conf

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin --filename=composer

WORKDIR /var/www/html

CMD [ "/usr/sbin/httpd", "-D", "FOREGROUND" ]