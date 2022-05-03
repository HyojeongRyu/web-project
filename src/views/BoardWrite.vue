<template>
  <div>
    <!----------------- 글쓰기 입력 폼 --------------->
    <div class="content-box">
      <div class="content-item title">
        <v-icon>mdi-pencil-outline</v-icon>
        <div class="title-text">게시판 글쓰기</div>
      </div>

      <v-divider style="margin-bottom: 20px; margin: 2%"></v-divider>

      <div class="content-item">
        <v-text-field label="제목" v-model="formData.boardName"></v-text-field>
      </div>

      <div class="content-item">
        <v-text-field
          label="카페이름"
          v-model="formData.cafeName"
          @click="searchDialog = !searchDialog"
        ></v-text-field>
      </div>

      <div class="content-item">
        <v-text-field
          label="카페주소"
          v-model="formData.cafeAddress"
          readonly
        ></v-text-field>
      </div>

      <div class="content-item">
        <v-file-input v-model="files" multiple label="첨부파일" outlined dense>
        </v-file-input>
      </div>

      <div class="content-item">
        <v-textarea
          outlined
          label="내용"
          v-model="formData.boardContent"
        ></v-textarea>
      </div>

      <div class="content-star">
        <div v-for="(star, index) in starList" :key="index" class="star-line">
          <div class="star-title">{{ star.text }}</div>
          <star-rating
            v-bind:show-rating="false"
            v-bind:active-on-click="true"
            v-bind:star-size="25"
            v-model="formData[star.id]"
          ></star-rating>
        </div>
      </div>
      <v-btn class="center-button" color="primary" @click="save">등록</v-btn>
    </div>
    <!----------------- 카페 주소 검색 다이얼로그 --------------->
    <v-dialog v-model="searchDialog" width="600">
      <v-card height="450">
        <v-list-item>
          <v-list-item-content>
            <div class="text-overline mb-4">카페 주소 검색</div>
            <div class="search-top">
              <v-text-field
                class="search-input"
                label="카페 이름"
                v-model="searchText"
                outlined
                dense
              ></v-text-field>
              <v-btn class="search-btn" color="primary" @click="searchCafe"
                >검색</v-btn
              >
            </div>
            <v-data-table
              v-model="selectedCafe"
              :headers="searchResultHeader"
              :items="searchResult"
              :disable-sort="true"
              hide-default-footer
              :single-select="true"
              item-key="title"
              show-select
              dense
              height="250"
            >
            </v-data-table>
            <v-divider></v-divider>
          </v-list-item-content>
        </v-list-item>
        <v-btn class="center-button" color="primary" @click="confirmDialog"
          >확인</v-btn
        >
      </v-card>
    </v-dialog>
    <!----------- 경고 다이얼로그 ------------>
    <alertDialog
      v-bind:alertMessage="alertMessage"
      v-on:closeAlertDialog="closeAlertDialog"
    ></alertDialog>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import alertDialog from "../components/Dialog.vue";

export default {
  components: {
    StarRating,
    alertDialog,
  },
  computed: {
    // userID() {
    //   return this.$store.state.userID;
    // },
  },
  data() {
    return {
      alertMessage: "",
      starList: [
        { text: "음식", value: 0, id: "starFood" },
        { text: "서비스", value: 0, id: "starService" },
        { text: "가격", value: 0, id: "starPrice" },
        { text: "분위기", value: 0, id: "starMood" },
      ],
      cafeName: "",
      searchText: "",
      searchDialog: false,
      searchResultHeader: [
        { text: "카페 이름", value: "title" },
        { text: "주소", value: "address" },
        { text: "도로명 주소", value: "roadAddress" },
      ],
      searchResult: [],
      selectedCafe: [],
      files: null,
      formData: {
        boardName: "",
        boardContent: "",
        starFood: 0,
        starService: 0,
        starPrice: 0,
        starMood: 0,
        cafeName: "",
        cafeAddress: "",
        userID: "yeojinny",
        files: "",
      },
    };
  },
  created() {
    this.formData.userID = this.userID;
  },
  methods: {
    closeAlertDialog() {
      this.alertMessage = "";
    },
    getStar(index) {
      this.score = index + 1;
    },
    searchCafe() {
      //posg: const params = {search:{keyword:this.searchText}};
      this.$axios.get(`/api/search/?keyword=${this.searchText}`).then((res) => {
        this.searchResult = res.data;
      });
    },
    confirmDialog() {
      this.$set(this.formData, "cafeAddress", this.selectedCafe[0].address);
      this.$set(this.formData, "cafeName", this.selectedCafe[0].title);
      this.searchDialog = false;
    },
    isEmpty() {
      if (this.formData.boardName === "") {
        this.alertMessage = "제목을 입력해주세요";
        return true;
      }
      if (this.formData.cafeName === "") {
        this.alertMessage = "카페이름을 입력해주세요";
        return true;
      }
      if (this.formData.boardContent === "") {
        this.alertMessage = "내용을 입력해주세요";
        return true;
      }
      if (
        this.formData.starFood === 0 ||
        this.formData.starService === 0 ||
        this.formData.starPrice === 0 ||
        this.formData.starMood === 0
      ) {
        this.alertMessage = "별점을 매겨주세요";
        return true;
      }

      return false;
    },
    /*
    글쓰기 저장
    */
    save() {
      //빈 항목이 존재한다면, 입력 알림
      if (this.isEmpty()) return;

      //서버에 저장(이미지 저장을 위해 FormData객체 사용)
      let fd = new FormData();

      for (let key in this.formData) {
        if (key === "files") {
          //이미지 여러개를 전송할 때 아래와 같이 하나하나 append 해줘야한다.
          for (let i in this.files) {
            fd.append("files", this.files[i]);
          }
        } else fd.append(key, this.formData[key]);
      }

      this.$axios
        .post("/api/board/save", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
        });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.content-box {
  margin: 5% 25%;
}
.content-item {
  margin: 2%;
}
.content-star {
  border-radius: 4px;
  padding: 10px 20px;
  margin: 2%;
  margin-bottom: 30px;
  border: 1px solid rgb(152, 152, 152);
}
.star-line {
  display: flex;
}
.star-title {
  color: gray;
  margin-top: 5px;
  font-size: 13px;
  width: 70px;
}
.center-button {
  margin: auto;
  display: block;
}
.search-top {
  display: flex;
}
.search-input {
  padding-right: 10px;
}
.search-btn {
  margin-top: 1px;
}
.title {
  display: flex;
  margin-bottom: 10px;
}
.title-text {
  margin-left: 10px;
  font-size: 16px;
  font-weight: bold;
}
</style>
