<script>
export default {
  props:['options'],
  data(){
    return{
      obtainedJsonPart: 0,
      obtainedJsonRes: [],
      closedSurvey: false,

    }
  },
  computed:{
    changeColor(){
      if(this.obtainedJsonPart < 3){
        return `background-color: yellow`
      }else{
        return `background-color: lime`
      }
    }
  },
  mounted(){
      fetch('http://localhost:3001/results')
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.obtainedJsonRes = json.responses
        this.obtainedJsonPart = json.participants
        this.closedSurvey = true
      })
    },
  }
</script>

<template>
  <div>
    Survey Results:
    <span v-if="this.closedSurvey == false">Still Opened</span>
    <div v-if="this.closedSurvey == true " >
      <div v-for="(option,index) in this.options" class="results"><span>{{option}}</span><span>{{ obtainedJsonRes[index] }}</span></div>
      <br />
      <div class="participants" :style="changeColor"><span>Participants:</span><span>{{ obtainedJsonPart }}</span></div>
    </div>
  </div>
</template>

<style scoped>
div.results {
  font-weight: bold;
  background-color:rgb(255, 204, 102);
}

div.participants {
  font-weight: bold;
} 
</style>