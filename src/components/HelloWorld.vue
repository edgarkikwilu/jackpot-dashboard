<template>
  <div id="app">
    <button v-if="drawStage=='winner-search'" class="btn-start-jackpot" @click="startJackpot">Start Jackpot</button>
    <div class="d-flex flex-row" style="flex-wrap: nowrap;" v-if="drawStage=='winner-confirmation'">
      <button class="btn-start-jackpot" @click="saveWinner('confirmed')">Confirm Winner</button>
      <button class="discard-button" @click="saveWinner('discard')">Discard Winner</button>
    </div>
    <div class="jackpot">
      <div v-for="(number, index) in jackpotNumbers" :key="index" class="number">
        {{ number }}
      </div>
    </div>
    <div class="winners">
      <h2>Winners</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(winner, index) in winners" :key="index">
            <td>{{ winner.name }}</td>
            <td>{{ winner.phoneNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      n: 9,
      jackpotNumbers: [0,0,0,0,0,0,0,0,0],
      isJackpotRunning: false,
      winners:[],
      selectedWinner:{},
      draw:{},
      drawStage:"winner-search" //winner-search, confirm-winner, discard-winner
    };
  },
  mounted(){
    this.initDraw()
  },
  methods: {
    async startJackpot(){

      this.isJackpotRunning = true;
      this.jackpotNumbers = [];

      const data = await this.fetchWinner()

      const interval = setInterval(() => {
        this.jackpotNumbers = Array.from(
          { length: this.n },
          () => Math.floor(Math.random() * 10)
        );
      }, 100);

      const interval2 = setInterval(() => {
        this.jackpotNumbers = [];
        this.jackpotNumbers = data.jackpotNumbers
      }, 3000);

      setTimeout(() => {
        clearInterval(interval);
        clearInterval(interval2);
        this.isJackpotRunning = false;
        this.drawStage = 'winner-confirmation'
      }, 3000);
      
    },
    async fetchWinner(){
      let response

      try {
        const res = await axios.post("jackpot")
        response = res.data
      } catch (error) {
        console.log("failed to fetch winner")
        console.log(error)
        alert("failed fetch winner")
        return
      }

      console.log(response)
      this.selectedWinner = response['winner']
      const jackpotNumbers = response['winner'].phoneNumber.split('')
      const winner = response.name

      return {jackpotNumbers, winner}
    },
    async initDraw(){
      try {
        const res = await axios.post("jackpot/draw")
        const response = res.data
        this.draw = response.draw
      } catch (error) {
        console.log("failed to fetch draw")
        console.log(error)
        alert("failed init draw")
      }

    },
    async saveWinner(status){
      this.drawStage = 'winner-search'
      this.jackpotNumbers = []
      console.log(this.draw)
      if(status == "confirmed"){
        this.winners.push(this.selectedWinner)
      }
      try {
        const body = {
          winnerStatus: status,
          participantId: this.selectedWinner['id'],
          drawId: this.draw['id']
        }
        console.log(body)
      
        const res = await axios.post("jackpot/winner", body, {})
        const response = res.data
        console.log(response)
      } catch (error) {
        console.log("failed to save winner")
        console.log(error)
        alert("failed to save winner")
      }

    }
  }
  }
</script>

<style>
  .btn-start-jackpot{
    margin: 40px 0;
  }

  .btn-start-jackpot{
    align-items: center;
    appearance: none;
    background-color: #FCFCFD;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    color: #36395A;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono",monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
  }

  .btn-start-jackpot:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  }

  .btn-start-jackpot:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  .btn-start-jackpot:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
  }
  .jackpot {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 100px;
    font-weight: bold;
    margin: 40px 0;
  }

  .number {
    margin: 0 10px;
    opacity: 0;
    animation: jackpot-spin 2s ease-in-out  forwards;
  }

  @keyframes jackpot-spin {
    0% {
      transform: scale(1);
      opacity: 0;
    }
    100% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  h2 {
      margin-top: 20px;
      font-size: 24px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
    }
    
    tr:hover {
      background-color: #f5f5f5;
    }

    .discard-button {
      margin: 0 20px;
      align-items: center;
      background-image: linear-gradient(135deg, #f34079 40%, #fc894d);
      border: 0;
      border-radius: 10px;
      box-sizing: border-box;
      color: #fff;
      cursor: pointer;
      font-family: "Codec cold",sans-serif;
      font-size: 16px;
      font-weight: 700;
      height: 54px;
      justify-content: center;
      letter-spacing: .4px;
      line-height: 1;
      max-width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 3px;
      text-decoration: none;
      text-transform: uppercase;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    .discard-button:active {
      outline: 0;
    }

    .discard-button:hover {
      outline: 0;
    }

    .discard-button span {
      transition: all 200ms;
    }

    .discard-button:hover span {
      transform: scale(.9);
      opacity: .75;
    }

    @media screen and (max-width: 991px) {
      .discard-button {
        font-size: 15px;
        height: 50px;
      }

      .discard-button span {
        line-height: 50px;
      }
    }
</style>