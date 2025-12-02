FROM php:8.3-fpm-alpine

# Instalar dependências
RUN apk add --no-cache nginx supervisor

# Criar diretórios e definir permissões
RUN mkdir -p /var/www/html /run/php /var/log && \
    chown -R www-data:www-data /var/www/html /run/php /var/log && \
    chmod -R 755 /var/www/html

# Definir o diretório de trabalho
WORKDIR /var/www/html

# Copiar o código da aplicação
COPY . .

# Copiar arquivos de configuração
COPY nginx.conf /etc/nginx/nginx.conf
COPY php-fpm.conf /usr/local/etc/php-fpm.conf
COPY php-fpm.d/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]