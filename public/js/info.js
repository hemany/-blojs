window.onload=function(){
    new Vue({
        'el':'body',
        'data':{
            title:'',
            introduce:'',
            title1:'',
            name:'',
            email:'',
            pass:'',
            name1:'',
            pass1:'',
            s_name:"",
            s_email:"",
            s_pass:"",
            id:"",
            s_epsss:"",
            emails:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        },
        ready:function(){
            if(document.cookie){
                this.id=document.cookie.split("=")[1]
                this.$http.get("http://localhost:9889/users",{
                    id:this.id
                }).then((data)=>{
                    console.log(data.data)
                    this.id=data.data
                },()=>{})
            }
            
        },
        'methods':{
            'register':function(){
                if(this.name!=""&&this.email!=""&&this.pass!=""){
                    if(this.emails.test(this.email)){
                        this.$http.get('http://localhost:9889/register',{
                            name:this.name,
                            email:this.email,
                            pass:this.pass
                        }).then((data)=>{
                            data.data.msg
                            if(data.data.msg=="注册成功"){
                                alert("注册成功")
                                this.name=""
                                this.email=""
                                this.pass=""
                            }
                        },()=>{
                            alert('注册失败')
                        });
                    }else{
                        alert("请填写正确邮箱格式")
                    }
                    
                }else{
                    alert("输入框不能为空")
                }
                
            },
            'login':function(){
                this.$http.get('http://localhost:9889/login',{
                    name:this.name1,
                    pass:this.pass1
                }).then((data)=>{
                    if(data.data.msg=="登录成功"){
                        alert("登录成功")
                        window.location.href="http://localhost:9889/index.html"
                    }
                },()=>{
                    alert('登录失败')
                });

            },
            'release':function(){
                var formNode = new FormData();
                formNode.append('title',this.title);
                formNode.append('file',file.files[0]);
                formNode.append('content',UE.getEditor('editor').getContent());
                formNode.append('introduce',this.introduce);
                formNode.append('user',this.id);
                this.$http.post('http://localhost:9889/release',formNode,{
                    emulateJSON:true
                }).then((data)=>{
                    if(data.data.ok == 1){
                        alert(data.data.msg);
                        $('#release').modal('toggle')
                    }
                    else{
                        alert(data.data.msg);
                    }
                },()=>{
                    alert('发布失败')
                });
            },
            'modify':function(){
                var formNode = new FormData();
                formNode.append('title',this.title1);
                formNode.append('file',file1.files[0]);
                formNode.append('content',UE.getEditor('editor1').getContent());
                this.$http.post('http://localhost:9889/modify',formNode,{
                    emulateJSON:true
                }).then((data)=>{
                    if(data.data.ok == 1){
                        alert(data.data.msg);
                        $('#modify').modal('toggle')
                    }
                    else{
                        alert(data.data.msg);
                    }
                },()=>{
                    alert('修改失败')
                });
            },
            yes:function(){
                if(this.s_name!=""&&this.s_email!=""){
                    this.$http.get("http://localhost:9889/verification",{
                        user:this.s_name,
                        email:this.s_email
                    }).then((data)=>{
                        if(data.data=="验证成功"){
                            $("#forget").modal("hide")
                            $("#forgets").modal("toggle")
                        }else{
                            alert("验证失败")
                        }
                    },()=>{
                        console.log("失败")
                    })
                }else{
                    alert("请把输入框补全")
                }
            },
            ok:function(){
                if(this.s_names!=""&&this.s_emails!=""){
                    if(this.s_epsss==this.s_pass){
                        this.$http.get("http://localhost:9889/affirm",{
                             user:this.s_name,
                            pass:this.s_pass
                        }).then((data)=>{
                           console.log(data)
                           if(data.data=="成功"){
                                this.s_name=""
                                this.s_email=""
                                this.s_epsss=""
                                this.s_emails=""
                                alert("成功")
                                $("#forgets").modal("hide")
                           }
                        },()=>{})
                    }else{
                        alert("请设置一致的密码")                        
                    }
                }else{
                     alert("请把输入框补全")
                }
            }
        }
    });
}