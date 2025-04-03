export function nginx(ip: string) {
  const nginxConf = `events {
        # Event directives...
    }
    
    http {
            server {
        listen 80;
        server_name ${ip};
    
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;

            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Allow-Credentials true;
        }
            }
    }`;

  const parseConf = nginxConf.replace(/(["`\\$])/g, "\\$1");
  const commands = [
    `echo "${parseConf}" | sudo tee /etc/nginx/nginx.conf > /dev/null`,
    "sudo cat /etc/nginx/nginx.conf",
    "sudo nginx -t",
    "sudo systemctl restart nginx",
  ];

  return commands;
}
