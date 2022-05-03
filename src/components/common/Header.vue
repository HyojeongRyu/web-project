<template>
  <header>
    <nav class="navbar">
      <!--화면 가로가 일정이상 작아질시 -->
      <div class="container mobile-container">
        <div class="content">
          <div class="left">left</div>
          <div class="brand-header">brand</div>
          <div class="right">right</div>
        </div>
      </div>

      <!--화면 가로가 일정이상 커질시 -->
      <div class="container desktop-container">
        <div class="content">
          <!-- 로고 -->
          <div class="brand-header">
            <router-link to="/">
              <img
                src="../../assets/images/PICA.svg"
                style="width: 60px; margin-right: 10px"
              />
            </router-link>
          </div>

          <!-- 메뉴 -->
          <div class="navbar-menu">
            <router-link
              v-for="(item, index) in getMenuItems"
              :key="index"
              class="navbar-item"
              v-bind:to="item.to"
            >
              {{ item.name }}
            </router-link>
          </div>

          <!-- 마이페이지 -->
          <div class="navbar-mypage">
            <div v-show="isLogin" class="navbar-mypage">
              <div class="navbar-item">마이페이지</div>
              <div v-on:click="logout" class="navbar-item">로그아웃</div>
            </div>
            <div v-show="!isLogin">
              <div v-on:click="login" class="navbar-item">로그인</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit("setLoginState", { userID: "" });
    },
    login() {
      //폼 입력 없이 바로 로그인 (임시)
      this.$store.dispatch("getUserInfo");
    },
  },
  computed: {
    getMenuItems() {
      return this.$store.getters.getMenuState["홈"].menuList;
    },
    isLogin() {
      return this.$store.getters.getLoginState.login;
    },
  },
};
</script>

<style scoped>
.mobile-container {
  display: none;
}
.desktop-container {
  display: block;
}
.navbar {
  background-color: white;
}
.content {
  display: flex;
  justify-content: space-between;
}
.navbar-menu {
  display: flex;
  align-items: center;
}
.navbar-mypage {
  display: flex;
  align-items: center;
}
.navbar-item {
  width: 150px;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  cursor: pointer;
}
</style>
