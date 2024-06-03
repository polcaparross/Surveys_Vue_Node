<script>
export default {
  props:['question', 'options'],
 
 data(){
    return{
      vote: undefined,
      but: false,
    }
  }, computed:{
    doFetch(){
      fetch(`http://localhost:3001/vote/${this.vote}`,{
      method: 'POST'
    })
    },
  },
}
</script>

<template>
  <div class="question">
    <span class="question">{{this.question}}</span>
    <span v-for="(option, index) in this.options"><input @click="this.but=true" type="radio" v-model="vote" :value="index"><label>{{ option }}</label></span>
    <button :disabled="!but" @click="doFetch">Send</button>
  </div>
</template>
<style scoped>
div.question {
  background-color: rgb(255, 153, 102);
}
</style>