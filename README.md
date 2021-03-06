## Rarity automation script
#### 1 复制代码 git clone https://github.com/goldenfiredo/rarity.git 到本地
#### 2 进入rarity目录，从ftmscan.com上下载你的ERC721交易记录csv文件，拷贝到本目录下并改名为export.csv
#### 3 运行 node csv.js 生成批处理文件: rarity.cmd和rarity.sh，分别用于Windows和Linux
#### 4 Linux下先执行chmod +x rarity.sh， 然后运行 ./rarity.sh 你的帐号私钥; Windows下直接运行 .\rarity.cmd 你的帐号私钥
#### 5 执行以上命令即可进行批量冒险[adventure]和升级[level-up]，并在svg目录下生成NFT的svg文件, 批处理每小时运行一次。可以自行修改间隔时间(rarity.sh的sleep或rarity.cmd的timeout参数)
#### 6 手动冒险的命令是: node rarity.js 帐号私钥 adventure token_id
#### 7 脚本也支持mint新NFT，命令是: node rarity.js 帐号私钥 summon 职业编号(1-11)
#### 8 新mint的summoner放进批量脚本里需要重复2-3步
#### * 保证账户里有足够的FTM(1个足够？) 

### Rarity attribute合约批量分配属性(point_buy)
#### a 上面第3步会同时生成 rarity_attribute.cmd和rarity_attribute.sh脚本
#### b Linux下第一次运行时先执行chmod +x rarity_attribute.sh, 然后运行 ./rarity_attribute.sh 你的帐号私钥; Windows下直接运行 .\rarity_attribute.cmd 你的帐号私钥 
#### c 执行以上命令即可批量分配属性[point_buy], 随机选择6个属性值, 并在svg目录下生成NFT的svg文件(合约有bug, 生成的svg文件看上去不可描述)
#### d 手动分配属性有2种参数: 1) 随机选择属性：node rarity_attribute.js 帐号私钥 point_buy -r token_id 2)指定属性值: node rarity_attribute.js 帐号私钥 point_buy -s token_id 力量 敏捷 体格 智力 智慧 魅力. 合法的属性值见ra_point_buy_inputs.txt文件
#### * 每个Summoner只能分配一次属性且不可逆

### Rarity gold合约批量领取金币(claim)
#### A (重新)运行 node csv.js 会生成 rarity_gold.cmd和rarity_gold.sh脚本
#### B Linux下第一次运行时先执行chmod +x rarity_gold.sh, 然后运行 ./rarity_gold.sh 你的帐号私钥; Windows下直接运行 .\rarity_gold.cmd 你的帐号私钥 
#### C 执行以上命令即可批量领取金币[claim]
#### D 手动领取金币的命令是: node rarity_gold.js 帐号私钥 claim token_id
#### * 你的Summoner升级到2级及以上才有金币可领，而且不领它也不会消失，所以只需在你*想*领的时候运行一次即可

##### 对rarity的简评及如何下载csv文件参见文章 https://k.mirror.xyz/xZbanjDkmORXIOygvV30I28jo27bSsV-g66DrYlr8iY. 感谢E酱～