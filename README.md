1. 云服务器用户名: root

密码: MYyj25@@

## 在 Ubuntu 22.04上安装 GitLab CE

sudo apt update
sudo apt upgrade -y
sudo apt install -y ca-certificates curl openssh-server tzdata

sudo apt install -y postfix

sudo apt update

```bash
# 安装依赖
sudo apt install -y curl openssh-server ca-certificates
# 添加 GitLab 官方仓库
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
```

sudo apt install gitlab-ce

sudo vim /etc/gitlab/gitlab.rb

external_url 'http://114.215.188.232'        

> <font color="red">上面这里如果使用了阿里云的节省停机模式, 需要每次启动实例后, 查看下当前服务器的公网ip是否被更改, 如果被更改了 重新在终端里打开vim编辑器设置一下</font>  



sudo gitlab-ctl reconfigure

cat /etc/gitlab/initial_root_password  *查看gitlab初始密码* 

> 设置防火墙规则

`sudo ufw allow http`
`sudo ufw allow https`



gitlab用户名: root

gitlab新密码: Yjoktakemehome

2. 浏览器输入 云服务器公网ip+端口号, 访问gitlab 并 修改gitlab账户的初始密码

在vscode中同步本地分支到远程分支时, 可以先本地生成SSH密钥, 然后去云服务器gitlab网页中配置密钥, 之后就可以直接 

> git add 文件
>
> git commit -m "修改说明"
>
> git push origin main

, 从而无需输入密码



## 在Ubuntu 22.04安装Gitlab Runner

curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

sudo apt install gitlab-runner

sudo gitlab-runner --version   *查看 GitLab Runner 版本* 

sudo gitlab-runner start          *启动 GitLab Runner 服务* 

sudo systemctl enable gitlab-runner     *设置Runner开机自启*  



2. 

   ```bash
   # 先安装nginx, 用来代理80端口的默认http网页服务
   sudo apt install nginx -y
   ```

(由于旧的注册runner方法已过时, 可以采取新的一键式操作)   注册gitlab-runner服务中的一个runner实例时, 仅需按照CI/CD里Runner的指示复制最后 registration 那一条指令到 服务器终端即可, 然后tag: 一般取名test ; optional: runner by shell ; 最后输入 shell 进行进一步选择



3. 设置ssh免密码安全传输

   安装sshpass服务

   ```bash
   sudo apt install sshpass
   ```

   

   并使用

   > 本地PC生成公私钥

   `ssh-keygen -t ed25519 -f gitlab-deploy-key -C "gitlab-ci@example.com" -N '""'`

cat gitlab-deploy-key.pub    # 显示本地生成的公钥, 并手动复制下来

ssh root@114.215.188.232      # 用windows powershell 登录远程服务器

mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "您的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

之后, 退出命令 exit

重新登录(无需输入密码) :

`ssh -i gitlab-deploy-key root@114.215.188.232`    





















ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

在远程服务器终端生成 ssh公私钥, 

将公钥添加到服务器指定目录下 ~/.ssh/authorized_keys, 

然后 在gitlab控制台settings/variables里添加变量 `key: SSH_PRIVATE_KEY`    value: (通过在服务器终端输入 `cat ~/.ssh/id_ed25519` 命令找到私钥)       记住这里最好是类型为"variable"而不是"file", 否则会有权限相关问题

图安全的话, 还可以添加一个SSH_HOST变量    value为 服务器公网ip 

最后, 在本地vscode当前目录下 新建一个名为 .gitlab-ci.yml 的文件

里面内容模版为 

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
  - ssh-keyscan -H 114.215.188.232 >> ~/.ssh/known_hosts
  script:
      - echo "开始部署到生产服务器..."
      - sshpass -p MYyj25@@ scp ./testSSH.html root@114.215.188.232:/var/www/html/
      - ssh root@114.215.188.232 'sudo systemctl reload nginx'
```



3. 如果在部署网页时, 主页面 例如"index.html"在本地编辑时重命名了, 然后用git提交推送到gitlab 后, 会出现无法正常渲染的情况, 因为需要修改  网页端口对应的index首页
   `sudo nano /etc/nginx/sites-available/default`

   然后重载nginx服务, 并刷新网页

   `sudo systemctl reload nginx` 



