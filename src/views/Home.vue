<template>
  <main>
    <section class="container">
      <!-- 상단배너 & 검색창 & 인기태그 -->
      <Hero />
      <!-- 타입별 카페 리스트 -->
      <PostList />
    </section>
  </main>
</template>

<script>
import Hero from "@/components/home/Hero.vue";
import PostList from "@/components/home/PostList.vue";
export default {
  components: {
    Hero,
    PostList,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
