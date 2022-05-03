<template>
  <div>
    <div class="board-top">
      <v-icon>mdi-filter</v-icon>
      <div class="filter">
        <select v-model="orderType">
          <option value="date">작성일순</option>
          <option value="like">좋아요</option>
          <option value="comment">댓글수</option>
        </select>
      </div>
      <!----------- 게시판 형태 메뉴 --------->
      <div class="form-type">
        <div class="form-area">
          <div v-if="loginState === true" class="write-type">
            <router-link to="/write">
              <button class="btn-tyle">
                <v-icon>mdi-pencil</v-icon>
                글쓰기
              </button>
            </router-link>
          </div>
          <div class="list-type">
            <img
              @click="viewType = 'list'"
              class="form-type"
              src="../assets/images/list.png"
              alt="list type"
            />
          </div>
          <div class="gallery-type">
            <img
              @click="viewType = 'gallery'"
              class="form-type"
              src="../assets/images/image.png"
              alt="gallery type"
            />
          </div>
        </div>
      </div>
    </div>
    <!-------------- 게시판 목록 --------------->
    <div
      :class="{
        'list-content': viewType === 'list',
        'gallery-content': viewType === 'gallery',
      }"
    >
      <table v-if="viewType === 'list'">
        <thead>
          <th v-for="(head, idx) in tableHeader" :key="idx">{{ head }}</th>
        </thead>
        <tbody>
          <tr v-for="(board, idx) in listData" :key="idx">
            <td @click="showDetail(board.boardID)">
              <router-link to="/detail">{{ board.boardName }}</router-link>
            </td>
            <td>{{ board.cafeName }}</td>
            <td>{{ board.cafeAddress }}</td>
            <td>{{ board.like }}</td>
            <td>{{ board.comment }}</td>
            <td>{{ board.createTime }}</td>
          </tr>
        </tbody>
      </table>

      <div class="gallery-container" v-if="viewType === 'gallery'">
        <div
          class="gallery-item"
          v-for="(board, index) in listData"
          :key="index"
        >
          <img class="gallery-img" :src="board.imagePath" />
          <div class="gallery-info">
            <div class="info-item boardName" @click="showDetail(board.boardID)">
              <router-link to="/detail">{{ board.boardName }}</router-link>
            </div>
            <div class="info-item createTime">{{ board.createTime }}</div>
            <div class="info-item cafeName">{{ board.cafeName }}</div>
            <div class="info-item cafeAddress">{{ board.cafeAddress }}</div>
            <div class="info-item">
              <img
                class="form-type like"
                src="../assets/images/thumb-up.png"
                alt="like icon"
              />{{ board.like }}
              <img
                class="form-type comment"
                src="../assets/images/comment.png"
                alt="like icon"
              />{{ board.comment }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <v-pagination
        v-model="currentPage"
        circle
        :length="pageLength"
        :total-visible="perBlock"
        @input="setPage"
      >
      </v-pagination>
    </div>
    <div class="search">
      <v-text-field
        dense
        solo
        label="search"
        prepend-inner-icon="mdi-magnify"
        v-model="searchText"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  computed: {
    // loginState() {
    //   return this.$store.state.loginState;
    // },
  },
  data() {
    return {
      loginState: true,
      tableHeader: ["제목", "카페이름", "위치", "좋아요", "댓글", "작성일"],
      listData: [],
      boardList: [],
      searchedList: [],
      targetList: [],
      orderType: "date",
      viewType: "list",
      searchText: "",
      pageLength: 0,
      currentPage: 1,
      perPage: 10,
      perBlock: 5,
    };
  },
  created() {
    this.$axios
      .get("/api/board")
      .then((res) => {
        this.boardList = res.data;
        for (let idx = 0; idx < this.boardList.length; idx++) {
          this.boardList[idx].like = 1;
          this.boardList[idx].comment = 1;
          this.boardList[idx].createTime = dayjs(
            this.boardList[idx].createTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }

        this.pageLength = Math.ceil(this.boardList.length / this.perPage); //총 페이지 수 = 게시글수/페이지당 게시글 수
        this.targetList = this.boardList;
        this.orderList();
        this.setPage();
      })
      .catch((error) => console.log(error));
  },
  watch: {
    searchText(val) {
      if (val != "") this.searchPost(val);
      else {
        this.targetList = this.boardList;
        this.renew();
      }
    },
    orderType() {
      this.renew();
    },
  },
  methods: {
    renew() {
      this.pageLength = Math.ceil(this.targetList.length / this.perPage);
      this.orderList();
      this.setPage();
    },
    searchPost() {
      this.targetList = this.boardList.filter((item) => {
        for (let i in item) {
          if (item[i].includes(this.searchText)) return true;
        }
      });

      this.renew();
    },
    setPage() {
      this.listData = this.targetList.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    showDetail(boardID) {
      console.log(boardID);
      let selectedPost = this.boardList.filter((element) => {
        if (element.boardID === boardID) return element;
      });
      this.$store.commit("selectPost", selectedPost);
    },
    orderList() {
      if (this.orderType === "date") {
        this.targetList.sort(function (a, b) {
          return dayjs(b.createTime).isAfter(dayjs(a.createTime)) ? 1 : -1;
        });
      } else if (this.orderType === "like") {
        this.targetList.sort(function (a, b) {
          return b.like - a.like;
        });
      } else if (this.orderType === "comment") {
        this.targetList.sort(function (a, b) {
          return b.comment - a.comment;
        });
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.board-top {
  width: 80%;
  margin: 5% auto 1% auto;
  display: flex;
}
.filter {
  margin-left: 10px;
  flex: 50%;
}
.form-type {
  flex: 50%;
  position: relative;
}
.form-area {
  width: 200px;
  display: flex;
}
.write-type {
  position: absolute;
  right: 80px;
}
.gallery-type {
  position: absolute;
  right: 30px;
}
.list-type {
  position: absolute;
  right: 0;
}
img.form-type {
  filter: invert(40%) sepia(9%) saturate(4%) hue-rotate(36deg) brightness(87%)
    contrast(85%);
}
/* .list-content {
  table-layout: fixed;
  height: 500px;
}
.gallery-content {
  table-layout: fixed;
  height: 1300px;
} */
table {
  margin: 0 auto;
  width: 80%;
  border: 1px solid #000000;
  /* 테두리사이 간격 없애기 */
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #000000;
  padding: 10px;
}
td {
  text-align: center;
}
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: 80%;
}
.gallery-item {
  display: flex;
  flex-basis: 50%;
}
.gallery-img {
  padding: 10px 10px;
  width: 250px;
  height: 250px;
}
.gallery-info {
  margin: 10px 10px;
  width: 300px;
}
img.like {
  margin-right: 5px;
}
img.comment {
  margin-left: 10px;
  margin-right: 5px;
}
.boardName {
  font-weight: bold;
}
.createTime {
  font-size: 13px;
}
.info-item.createTime {
  margin-bottom: 10px;
}
.info-item.cafeAddress {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 5px;
}
.search {
  width: 500px;
  margin: 10px auto;
}
.btn-tyle {
  font-size: 12px;
  color: #000000;
  border: #929292 solid 2px;
  border-radius: 10px;
  padding-bottom: 1px;
  padding: 0 5px;
  margin-top: 1px;
}
</style>
