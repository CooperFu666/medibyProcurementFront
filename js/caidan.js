(function(){
    if(!window.console){window.console ={log:function(){}};return;}
    var me = 19;
    var Star = function(){
        this.x=0;
        this.speed = 1;
        this.y=0;
    }
    var score = 0;
    var strs = function(){
        var result = '';
        for(var i=0;i<20;i++){
            result+="\n"
            for(var n =0;n<40;n++){
                var now = '一'
                if(i==19&&n==me){
                    now="码"
                }
                if(i==19&&n==me+1){
                    now="农"
                }
                stars.forEach(function(star){
                    var x= Math.floor(star.x);
                    var y = Math.floor(star.y)
                    if(x==n&&y==i){
                        if(Math.abs(star.y-19)<1&&(n==me||n==me+1)){
                            die()
                        }
                        now="针"
                    }
                })
                result+=now;

            }

        }
        result+="       《码农躲针头》得分："+score
        return result;
    }
    window.onkeydown = function(e){
        if(e.keyCode==37){
            me-=1;
            if(me<0) me=0;
        }else if(e.keyCode==39){
            me+=1
            if(me>38) me=38
        }
    }
    var count=0;
    var die = function(){
        clearInterval(timer1)
        clearInterval(timer2)
        clearInterval(timer3)
        setTimeout(function(){
            console.log("游戏结束，您的得分："+score+"","###")
        },100)

    }
    var stars = []
    var appearP = 1
    var timer1,timer2,timer3;
    var begin = function(){
        timer1 = setInterval(function(){
            var createCount=Math.floor(Math.random()*5*appearP)
            for(var i=0;i<createCount;i++){
                var star = new Star();
                star.x = Math.floor(Math.random()*40)
                star.y = 0;
                star.speed = Math.random()*appearP;//Math.floor(Math.random()*3+1)
                stars.push(star)
            }

        },1000)
        timer2 = setInterval(function(){
            stars.forEach(function(star,i){
                star.y+=star.speed;
                if (star.y>=31){
                    stars.splice(i,1);
                    score++
                }
            })
            console.log(strs())
            count++;
            if(count>300){
                console.clear()
                count = 0;
            }
        },100)
        timer3 = setInterval(function(){
            appearP*=1.1
        },3000)
    }
    console.log("输入 start(); 后即可开始《码农躲针》游戏！")
    window.start = function(){
        appearP=1.1
        starts=[];
        score=0;
        me = 19;
        count = 0;
        console.log("%c请先用鼠标点击一下医加网页页面，游戏需要捕捉网页上的键盘事件（你应该懂吧）！","font-size:16px;color:#ff6700;")
        console.log("使用键盘左右键移动最下方的码农，躲开所有的注射器，注射器数量和速度会一直增加，看看谁坚持的最久吧！")

        var countdown = 6;
        setTimeout(function(){
            if(countdown--<=1){
                begin();
            }else{
                console.log(countdown)
                setTimeout(arguments.callee,1000)
            }
        },1000)
        return ("倒计时！")
    }
})();