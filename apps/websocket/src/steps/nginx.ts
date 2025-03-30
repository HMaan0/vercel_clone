// NOT USED CURRENTLY
export function nginx(ip: string, port: string) {
  const nginxConf = `events {
        # Event directives...
    }
    
    http {
            server {
        listen 80;
        server_name ${ip};
    
        location / {
            proxy_pass http://localhost:${port};
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
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
