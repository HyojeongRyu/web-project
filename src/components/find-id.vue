<template lang="">
    <div>
        <div class="container_login">
            <h4>아이디찾기</h4>
        <div class="wrap_login">
            <input class="name" type="text" placeholder="이름을 입력하세요"/>
            <input class="email" type="password" placeholder="이메일을 입력하세요"/>
            <router-link to="/find-id-result">
                <button class="ok">다음</button>
            </router-link>
        </div>
       
    </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style >
.container_login{
    width:400px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

    .wrap_login{
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .name{
        text-align: center;
        width: 90%;
        
    }
    .email{
        text-align: center;
        width: 90%;
        
    }
    .ok{
        width:90%;
        margin:10px;
    }
    .wrap_find button{
        margin:5px;
    }
</style>