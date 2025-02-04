<template>
  <el-container>
    <el-form :model="form" class="exchange-form">
      <el-form-item label="从货币" label-width="80px">
        <el-select v-model="form.fromCurrency" placeholder="选择货币">
          <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-form-item>
      <el-form-item label="到货币" label-width="80px">
        <el-select v-model="form.toCurrency" placeholder="选择货币">
        <el-option v-for="currency in currencies" :key="currency" :label="currency" :value="currency" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额" label-width="80px">
        <el-input v-model="form.amount" type="number" placeholder="请输入金额" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin-left: 80px;" @click="exchange">兑换</el-button>
        <div v-if="result" class="result" >
          <p>兑换结果:{{result}}</p>
        </div>
      </el-form-item>
    </el-form>

  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from '../axios/axios'


interface ExchangeInfo {
  fromCurrency: string;
  toCurrency: string;
  rates: number;
}

const form = ref({
  fromCurrency: '',
  toCurrency: '',
  amount: 0
})
const result = ref<number | null>(null)
const currencies = ref<string[]>([]);
const rates = ref<ExchangeInfo[]>([])

const fetchCurrencies = async () => {
  try{
  const res = await axios.get<ExchangeInfo[]>('/exchangeRates');
  rates.value = res.data;
  currencies.value = [
    ...new Set(
      res.data
      .map((rate: ExchangeInfo) => [rate.fromCurrency, rate.toCurrency])
      .flat()
    ),
  ];
  }catch(err){
    console.log('获取数据失败',err)
  }
}
;
const exchange = () =>{
  const rate = rates.value.find(
    (rate) =>
      rate.fromCurrency === form.value.fromCurrency &&
      rate.toCurrency === form.value.toCurrency
  )?.rate;
  if(rate){
    result.value = form.value.amount * rate
  }else{
    result.value = null
  }
} 




onMounted(fetchCurrencies)
</script>
<style scoped>
.exchange-form {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 35px;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);
}

.result {
  margin-left: 300px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 35px;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 18px;
}
</style>