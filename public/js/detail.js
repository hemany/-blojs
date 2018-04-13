window.onload=function(){
	Vue.directive('reset',function(){
        var el=this.el
        console.log(el)	 
		var tags = this.el.getElementsByTagName('*');
		for (var i = 0; i < tags.length; i++) {
			    tags[i].removeAttribute('style');
			    tags[i].href="javascript:;"
			    tags[i].className=""
			    tags[i].style.display="inline-block"
			    tags[i].style.width="100%"
		}
    })

	new Vue({
		el:"body",
		methods:{
			pin:function(){
				if(this.user=="login"){
					alert("请登录")
					window.location.href="http://localhost:9889/views/sign.html"
				}else{
					if(this.sayone==""||this.sayone==null||this.sayone==undefined){
						this.sayone=[];
					}
					var json={};
					json.name=this.user;
					json.say=this.say;
					this.$http.get("http://localhost:9889/say",{
						say:json
					}).then((data)=>{
						console.log(data)
					},()=>{
						console.log("失败")
					})
					console.log(this.say)
					this.sayone.push(json);
					console.log(this.sayone);
					this.say="";
				}
			},
			users:function(){
				if(this.user=="login"){
					
					window.location.href="http://localhost:9889/views/sign.html"
				}
			}
		},
		data:{
			a:"1",
			msg:[],
			msa:[],
			mss:[],
			sayone:[],
			id:"",
			say:"",
			user:"login"
		},
		ready:function(){
			if(document.cookie){
				this.id=document.cookie.split("=")[1]
				console.log(this.id)
				this.$http.get("http://localhost:9889/details",{
					userId:this.id
				}).then((data)=>{
					// console.log(data.data)
					this.user=data.data.user
					this.msg=data.data.datas
					this.msa=data.data.data
					console.log(data.data.data[0].say)
					console.log(jj)
					if(data.data.data[0].say==""){
						this.sayone=[]
					}else{
						var jj=JSON.parse(data.data.data[0].say)
						this.sayone=jj
					}
					this.mss=data.data.all
				},()=>{
					console.log("失败")
				})
			}else{
				this.$http.get("http://localhost:9889/detail").then((data)=>{
					console.log(data.data)
					this.msg=data.data.datas
					this.msa=data.data.data
					this.mss=data.data.all
					if(data.data.data[0].say==""){
						this.sayone=[]
					}else{
						var jj=JSON.parse(data.data.data[0].say)
						this.sayone=jj
					}
					console.log(this.msg)
					console.log(this.msa)
				},()=>{})
			}

		}
	})
}