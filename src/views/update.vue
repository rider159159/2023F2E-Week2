<script setup>
import cityObj from '@/assets/test/updateObj.json'
import cityArray from '@/assets/test/updateArray.json'

const newCityObj = ref({})
function updateJSON() {
  const trimCityArray = cityArray.tainan.map((i) => {
    i.fieldCN = i.fieldCN.trim()
    return i
  })

  trimCityArray.forEach((item) => {
  // 使用 fieldCN 作為鍵值,尋找對應的物件
    const key = item.fieldCN
    const objKey = cityObj[key] ? key : Object.keys(cityObj).find(k => cityObj[k].fieldCN === key)
    if (objKey) {
    // 如果存在對應的物件,則更新欄位值
      cityObj[objKey].validVotes = convertToInteger(item.validVotes)
      cityObj[objKey].invalidVotes = convertToInteger(item.invalidVotes)
      cityObj[objKey].votes = convertToInteger(item.votes)
      cityObj[objKey].unUseVotes = convertToInteger(item.unUseVotes)
      cityObj[objKey].publishedVotes = convertToInteger(item.publishedVotes)
      cityObj[objKey].leftVotes = convertToInteger(item.leftVotes)
      cityObj[objKey].allVotes = convertToInteger(item.allVotes)
      cityObj[objKey].voteRate = Number(item.voteRate)
      cityObj[objKey].candidate1.party = '台灣民眾黨'
      cityObj[objKey].candidate1.president = '柯文哲'
      cityObj[objKey].candidate1.vicePresident = '吳欣盈'
      cityObj[objKey].candidate1.votes = convertToInteger(item.candidate1)
      cityObj[objKey].candidate2.party = '民主進步黨'
      cityObj[objKey].candidate2.president = '賴清德'
      cityObj[objKey].candidate2.vicePresident = '蕭美琴'
      cityObj[objKey].candidate2.votes = convertToInteger(item.candidate2)

      cityObj[objKey].candidate3.party = '中國國民黨'
      cityObj[objKey].candidate3.president = '侯友宜'
      cityObj[objKey].candidate3.vicePresident = '趙少康'
      cityObj[objKey].candidate3.votes = convertToInteger(item.candidate3)
    }
  })
  newCityObj.value = cityObj
  console.log(newCityObj.value)
}

function convertToInteger(str) {
  if (str.includes(','))
    return Number.parseInt(str.split(',').join(''), 10)
  else
    return Number.parseInt(str, 10)
}

onMounted(() => {
  updateJSON()
})
</script>

<template>
  <div>
    更新 JSON 用
  </div>
</template>
