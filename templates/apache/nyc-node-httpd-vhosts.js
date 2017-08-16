module.exports = function( data ){
  return `# BCOM Virtual Hosts for NYC Node Demo

# left-nav-backend
<VirtualHost *:80>    
    ServerName left-nav-backend.nyc-node.com
    ServerAlias www.left-nav-backend.nyc-node.com
    ProxyPass /api/v1/left-nav http://localhost:3030/api/v1/left-nav
</VirtualHost>

# left-nav-frontend
<VirtualHost *:80>    
    ServerName left-nav-frontend.nyc-node.com
    ServerAlias www.left-nav-frontend.nyc-node.com
    ProxyPass /api/v1/left-nav http://left-nav-backend.nyc-node.com/api/v1/left-nav
    ProxyPass / http://left-nav-frontend.nyc-node.com:3000/
</VirtualHost>                             
`;
};