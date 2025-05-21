## Install GitLab CE On  Ubuntu 22.04

```bash
# install dependencies
sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl openssh-server tzdata
sudo apt install -y postfix
sudo apt install -y curl openssh-server ca-certificates
# add GitLab repository & install
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
sudo apt install gitlab-ce
```



### configure the gitlab with the ECS public IP

```bash
sudo vim /etc/gitlab/gitlab.rb
```

And edit as  `external_url 'http://114.215.188.232'`         

> <font color="red">If the developer or user use the "economical-mode", there is a need to check the public IP changed or not for each booting</font>  

Then, reconfigure the Gitlab with the following command

```bash
sudo gitlab-ctl reconfigure
```



### Initial Use Of Gitlab

```bash
cat /etc/gitlab/initial_root_password  # get the initial password 
```

> If the firewall blocks the gitlab service, we also need to add the following 2 rules with commands

`sudo ufw allow http`      `sudo ufw allow https`

And use browser to access the ECS_IP + port_number, and modify the initial user password with the gitlab dashboard.



### Finish the version control without verifying with gitlab password

When the local branch needs to be pushed to the cloud, we could solve the password verification with the generated SSH key. And the key would be configured with the dashboard. 

> git add ${file}
>
> git commit -m "modify"
>
> git push origin main



## Install Gitlab Runner On Ubuntu 22.04

1. 

```bash
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt install gitlab-runner
sudo gitlab-runner --version 
sudo gitlab-runner start    
sudo systemctl enable gitlab-runner     # set the Runner auto-start
```

2. 

   ```bash
   # install nginx
   sudo apt install nginx -y
   ```

3.  

    ```bash
    # install sshpass
    sudo apt install sshpass
    ```

4.  

    > generate public/private key for SSH tube

    `ssh-keygen -t ed25519 -f gitlab-deploy-key -C "gitlab-ci@example.com" -N '""'`

```bash
cat gitlab-deploy-key.pub 
ssh root@${ECS-IP}     # log in with Windows powershell 
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo ${public_key} >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```



Then, `exit` 

verify the connection (no password) :

`ssh -i gitlab-deploy-key root@${ECS-IP}`    

### Complete the CI

ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

Then gitlab add some cpnfigurations on the dashboard settings/variables。

For more security，SSH_HOST varaibale could be set and value should be the office time。

Finally，create .gitlab-ci.yml file （contained）, and after deployment we could test the connection. 

```yml
stages:
  - deploy 

deploy-job:
  tags: 
    - testRunner
  stage: deploy

  before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
  - mkdir -p ~/.ssh
  - chmod 700 ~/.ssh
  - ssh-keyscan -H $(ECS+IP) >> ~/.ssh/known_hosts
  script:
      - echo "Start deployment..."
      - sshpass -e scp ./testSSH.html root@{$ECS+IP}:/var/www/html/
      - ssh root@{$ECS+IP} 'sudo systemctl reload nginx'
```



### When deploying a web page

, if the main page (e.g., 'index.html') is renamed during local editing and then pushed to GitLab via Git, rendering issues may occur. This happens because the web server’s default document (e.g., 'index.html') must match the renamed file. Thus, the server configuration (e.g., Nginx) must be updated to reflect the new filename.
`sudo nano /etc/nginx/sites-available/default`

Then reload the nginx service 

`sudo systemctl reload nginx` 



## map local application to the ECS

set the data

```bash
ssh -R 8080:localhost:8080 root@ECS_IP -N
```

create a conf file

```nginx
# /etc/nginx/sites-available/dify.conf
server {
    listen 80;
    server_name ${ECS-IP};  

    location /api/chat {
        # map the proxy to the Dify service
        proxy_pass http://localhost:8080/v1/chat-messages;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # configure the static web page
    location / {
        root /var/www/html;
        index index.html;
    }
}
```



