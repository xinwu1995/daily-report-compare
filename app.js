var CITY_DATA = {
  name: '武汉市',
  districts: [
    {
      name: '武昌区',
      children: [
        { name: '片区组1', children: ['中南路片区', '水果湖片区', '徐东片区', '积玉桥片区', '杨园片区'] },
        { name: '片区组2', children: ['白沙洲片区', '南湖片区', '首义片区'] }
      ]
    },
    {
      name: '汉阳区',
      children: [
        { name: '片区组1', children: ['钟家村片区', '王家湾片区', '四新片区'] },
        { name: '片区组2', children: ['鹦鹉洲片区', '琴台片区'] }
      ]
    },
    {
      name: '江夏区',
      children: ['纸坊片区', '庙山片区', '藏龙岛片区', '流芳片区']
    },
    {
      name: '蔡甸区',
      children: ['蔡甸城区', '常福片区', '中法生态城']
    }
  ]
};

var BASE = {
  revenue: 38456, revenueChange: 3.2,
  storedRevenue: 8230, storedRevenueChange: 1.8,
  adRevenue: 2680, adRevenueChange: -0.5,
  orderCount: 5312, orderCountChange: 2.1,
  availableVehicles: 4021,
  unavailableBreakdown: [245, 198, 176, 152, 134, 112, 98, 85, 65],
  noOrderVehicles: 1830, noOrder5: 1230, noOrder15: 680,
  static3: 1420, static5: 890, static15: 450,
  swapComplete: 2156, dispatchVehicles: 1265, dispatchRate: 82.5,
  repairOrders: 347, repairComplete: 298,
  batteryBelow10: 156, battery10to20: 243, battery20to30: 357,
  lostByLowBattery: 313,
  dispatchRates: [72, 82.5, 87, 90, 91.5, 92],
  dispatchCounts: [180, 350, 520, 720, 900, 1077],
  avgPrice: 7.24, avgPriceWithFine: 8.12, avgPriceWithoutFine: 6.58,
  avgDuration: 86,
  lostOutOfRange: 256, lostLowBattery: 138, lostFault: 82, lostOther: 51,
  availableRate: 76.8, availableRateChange: 1.2,
  ridingRate: 42.5, ridingRateChange: -0.6,
  outOfRangeCount: 384, outOfRangeCountChange: -2.1,
  lowBatteryCount: 756, lowBatteryCountChange: 1.8,
  inactiveUsers: 2136, inactiveUsersChange: -1.3,
  frequentUsers: 1847, frequentUsersChange: 2.8,
  totalRideUsers: 18432, totalRideUsersChange: 0.9,
  newBindUsers: 326, newBindUsersChange: 5.2,
  newUserRetention: 34.6, newUserRetentionChange: 1.1,
  receivableOrderCount: 5860, receivableOrderCountChange: 2.5,
  receivableAmount: 42130, receivableAmountChange: 3.8,
  fineOrderCount: 426, fineOrderCountChange: -1.2,
  fineOrderAmount: 3184, fineOrderAmountChange: -0.8,
  disputeCount: 89, disputeCountChange: 1.5,
  disputeRefund: 1247, disputeRefundChange: 2.3,
  rideCardDeduct: 1532, rideCardDeductChange: 4.1,
  couponDeduct: 876, couponDeductChange: 3.6
};

function seededRandom(seed) {
  var x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function vary(base, dayIndex, fieldIndex) {
  var factor = 0.85 + seededRandom(dayIndex * 1000 + fieldIndex) * 0.30;
  return Math.round(base * factor);
}

function varyDecimal(base, dayIndex, fieldIndex, decimals) {
  var factor = 0.85 + seededRandom(dayIndex * 1000 + fieldIndex) * 0.30;
  return +(base * factor).toFixed(decimals);
}

function varyChange(base, dayIndex, fieldIndex) {
  var offset = (seededRandom(dayIndex * 2000 + fieldIndex) - 0.5) * 6;
  return +(base + offset).toFixed(1);
}

function formatNumber(num) {
  if (num == null) return '-';
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function generateDayData(dayIndex) {
  var fi = 0;
  var availableVehicles = vary(BASE.availableVehicles, dayIndex, fi++);
  var unavailableBreakdown = [];
  for (var b = 0; b < BASE.unavailableBreakdown.length; b++) {
    unavailableBreakdown.push(vary(BASE.unavailableBreakdown[b], dayIndex, fi++));
  }
  var unavailableVehicles = unavailableBreakdown.reduce(function(s, v) { return s + v; }, 0);
  var totalVehicles = availableVehicles + unavailableVehicles;
  var noOrder3 = vary(BASE.noOrderVehicles, dayIndex, fi++);
  var noOrder5 = Math.min(noOrder3 - 1, vary(BASE.noOrder5, dayIndex, fi++));
  var noOrder15 = Math.min(noOrder5 - 1, vary(BASE.noOrder15, dayIndex, fi++));
  var static3 = Math.min(noOrder3 - 1, vary(BASE.static3, dayIndex, fi++));
  var static5 = Math.min(Math.min(noOrder5, static3) - 1, vary(BASE.static5, dayIndex, fi++));
  var static15 = Math.min(Math.min(noOrder15, static5) - 1, vary(BASE.static15, dayIndex, fi++));
  var noOrderVehicles = noOrder3;
  var availableRate = +((availableVehicles / totalVehicles) * 100).toFixed(2);
  var ridingRate = varyDecimal(BASE.ridingRate, dayIndex, fi++, 2);
  var outOfRangeCount = vary(BASE.outOfRangeCount, dayIndex, fi++);
  var lowBatteryCount = vary(BASE.lowBatteryCount, dayIndex, fi++);
  fi++; fi++; fi++; fi++;
  var repairOrders = vary(BASE.repairOrders, dayIndex, fi++);
  var repairComplete = Math.min(repairOrders, vary(BASE.repairComplete, dayIndex, fi++));
  var lostOutOfRange = vary(BASE.lostOutOfRange, dayIndex, fi++);
  var lostLowBattery = vary(BASE.lostLowBattery, dayIndex, fi++);
  var lostFault = vary(BASE.lostFault, dayIndex, fi++);
  var lostOther = vary(BASE.lostOther, dayIndex, fi++);
  var lostOrders = lostOutOfRange + lostLowBattery + lostFault + lostOther;
  fi += 24; // skip staff
  var batteryBelow10 = vary(BASE.batteryBelow10, dayIndex, fi++);
  var battery10to20 = vary(BASE.battery10to20, dayIndex, fi++);
  var battery20to30 = vary(BASE.battery20to30, dayIndex, fi++);
  var lowBatteryVehicles = batteryBelow10 + battery10to20 + battery20to30;
  fi++; // lostByLowBattery
  fi += 12; // dispatchRates + dispatchCounts
  var avgPrice = varyDecimal(BASE.avgPrice, dayIndex, fi++, 2);
  fi++; fi++; // avgPriceWithFine, avgPriceWithoutFine
  var avgDuration = vary(BASE.avgDuration, dayIndex, fi++);
  var cfi = 0;
  return {
    revenue: vary(BASE.revenue, dayIndex, fi++),
    orderCount: vary(BASE.orderCount, dayIndex, fi++),
    totalVehicles: totalVehicles,
    availableVehicles: availableVehicles,
    unavailableVehicles: unavailableVehicles,
    unavailableBreakdown: unavailableBreakdown,
    noOrderVehicles: noOrderVehicles,
    availableRate: availableRate,
    ridingRate: ridingRate,
    swapComplete: vary(BASE.swapComplete, dayIndex, fi++),
    dispatchVehicles: vary(BASE.dispatchVehicles, dayIndex, fi++),
    dispatchRate: varyDecimal(BASE.dispatchRate, dayIndex, fi++, 2),
    repairOrders: repairOrders,
    repairComplete: repairComplete,
    lowBatteryVehicles: lowBatteryVehicles,
    avgPrice: avgPrice,
    avgDuration: avgDuration,
    lostOrders: lostOrders,
    fineOrderCount: vary(BASE.fineOrderCount, dayIndex, fi++),
    fineOrderAmount: vary(BASE.fineOrderAmount, dayIndex, fi++),
    disputeCount: vary(BASE.disputeCount, dayIndex, fi++),
    disputeRefund: vary(BASE.disputeRefund, dayIndex, fi++),
    rideCardDeduct: vary(BASE.rideCardDeduct, dayIndex, fi++),
    couponDeduct: vary(BASE.couponDeduct, dayIndex, fi++),
    inactiveUsers: vary(BASE.inactiveUsers, dayIndex, fi++),
    frequentUsers: vary(BASE.frequentUsers, dayIndex, fi++),
    totalRideUsers: vary(BASE.totalRideUsers, dayIndex, fi++),
    newBindUsers: vary(BASE.newBindUsers, dayIndex, fi++),
    newUserRetention: varyDecimal(BASE.newUserRetention, dayIndex, fi++, 1),
    confiscatedVehicles: unavailableBreakdown[7],
    faultVehicles: unavailableBreakdown[3]
  };
}

var COMPARE_SECTIONS = [
  {
    key: 'highlight', name: '重点关注数据',
    metrics: [
      { key: 'orderCount', label: '实收订单量', info: true },
      { key: 'dispatchRate', label: '12小时调度成单率', format: 'percent', info: true },
      { key: 'availableVehicles', label: '可用车辆', info: true },
      { key: 'confiscatedVehicles', label: '扣押车辆', info: true },
      { key: 'lowBatteryVehicles', label: '低电车辆', info: true },
      { key: 'faultVehicles', label: '故障车辆', info: true }
    ]
  },
  {
    key: 'vehicle', name: '车辆数据',
    metrics: [
      { key: 'totalVehicles', label: '运营车辆数' },
      { key: 'availableVehicles', label: '可用车辆数' },
      { key: 'unavailableVehicles', label: '不可用车辆数' },
      { key: 'noOrderVehicles', label: '未产生订单车辆' },
      { key: 'availableRate', label: '车辆可用率', format: 'percent' },
      { key: 'ridingRate', label: '车辆被骑行率', format: 'percent' }
    ]
  },
  {
    key: 'orderOverview', name: '订单大盘数据',
    metrics: [
      { key: 'revenue', label: '实收订单金额' },
      { key: 'orderCount', label: '实收订单量' },
      { key: 'avgPrice', label: '均单价', format: 'decimal' },
      { key: 'avgDuration', label: '均单时长(分钟)' },
      { key: 'lostOrders', label: '丢单次数' }
    ]
  },
  {
    key: 'ops', name: '运维数据',
    metrics: [
      { key: 'swapComplete', label: '换电完成数' },
      { key: 'dispatchVehicles', label: '调度车辆数' },
      { key: 'dispatchRate', label: '12小时调度成单率', format: 'percent' },
      { key: 'repairOrders', label: '报修单数' },
      { key: 'repairComplete', label: '报修完成数' }
    ]
  },
  {
    key: 'userOrder', name: '用户维度订单数据',
    metrics: [
      { key: 'fineOrderCount', label: '调度费/罚金订单数' },
      { key: 'fineOrderAmount', label: '调度费/罚金金额' },
      { key: 'disputeCount', label: '异议工单数' },
      { key: 'disputeRefund', label: '异议退款金额' },
      { key: 'rideCardDeduct', label: '骑行卡抵扣次数' },
      { key: 'couponDeduct', label: '优惠卡抵扣次数' }
    ]
  },
  {
    key: 'userAttr', name: '用户属性数据',
    metrics: [
      { key: 'inactiveUsers', label: '>3天未骑行用户数' },
      { key: 'frequentUsers', label: '近7天骑行≧4次' },
      { key: 'totalRideUsers', label: '累计骑行用户数' },
      { key: 'newBindUsers', label: '新增绑定用户数' },
      { key: 'newUserRetention', label: '新用户7日留存率', format: 'percent' }
    ]
  }
];

var DISTRICT_WEATHERS = [
  { weather: '毛毛雨', temp: '28℃' },
  { weather: '毛毛雨', temp: '28℃' },
  { weather: '毛毛雨', temp: '28℃' },
  { weather: '毛毛雨', temp: '28℃' }
];

var compareState = {
  open: false,
  currentDay: 0,
  selectedAreas: [0, 1, 2, 3],
  expandedSections: { highlight: true }
};

var compareDataCache = {};

function generateCompareDataForDistrict(districtIdx) {
  var cacheKey = districtIdx + '_' + compareState.currentDay;
  if (compareDataCache[cacheKey]) return compareDataCache[cacheKey];
  var seed = districtIdx * 37 + compareState.currentDay + 7;
  var data = generateDayData(seed);
  if (districtIdx === 3) data.confiscatedVehicles = null;
  compareDataCache[cacheKey] = data;
  return data;
}

function formatCompareVal(value, format) {
  if (value == null) return '--';
  if (format === 'percent') return (value % 1 === 0 ? value : value.toFixed(1)) + '%';
  if (format === 'decimal') return value.toFixed(2);
  return formatNumber(value);
}

function renderComparePage() {
  var areas = compareState.selectedAreas;
  var labelW = 96, cellW = 88, addW = 40;
  var totalW = labelW + areas.length * cellW + addW;

  var html = '<div class="compare-inner" style="min-width:' + totalW + 'px">';

  html += '<div class="compare-area-row">';
  html += '<div class="compare-label-cell"><span class="compare-area-label-text">服务区</span><span class="compare-swap-icon">⇌</span></div>';
  for (var i = 0; i < areas.length; i++) {
    var d = CITY_DATA.districts[areas[i]];
    var w = DISTRICT_WEATHERS[areas[i] % DISTRICT_WEATHERS.length];
    html += '<div class="compare-area-cell">'
      + '<div class="compare-area-pin"><span class="compare-pin-text">钉在左侧</span><span class="compare-area-remove" data-remove-area="' + i + '">×</span></div>'
      + '<div class="compare-area-name">' + d.name + '</div>'
      + '<div class="compare-area-weather">' + w.weather + '</div>'
      + '<div class="compare-area-temp">' + w.temp + '</div>'
      + '</div>';
  }
  html += '<div class="compare-add-cell" id="compareAddBtn">+</div>';
  html += '</div>';

  for (var s = 0; s < COMPARE_SECTIONS.length; s++) {
    var section = COMPARE_SECTIONS[s];
    var expanded = !!compareState.expandedSections[section.key];

    html += '<div class="compare-section-header" data-compare-section="' + section.key + '">'
      + '<span>' + section.name + '</span>'
      + '<span class="compare-arrow">' + (expanded ? '▼' : '▲') + '</span>'
      + '</div>';

    if (expanded) {
      var rowW = labelW + areas.length * cellW;
      for (var m = 0; m < section.metrics.length; m++) {
        var metric = section.metrics[m];
        html += '<div class="compare-data-row" style="min-width:' + rowW + 'px">';
        html += '<div class="compare-label-cell">'
          + metric.label
          + (metric.info ? ' <span class="compare-info-icon">ⓘ</span>' : '')
          + '</div>';
        for (var a = 0; a < areas.length; a++) {
          var data = generateCompareDataForDistrict(areas[a]);
          var val = data[metric.key];
          var cls = val == null ? ' na' : '';
          html += '<div class="compare-data-cell' + cls + '">' + formatCompareVal(val, metric.format) + '</div>';
        }
        html += '</div>';
      }
    }
  }

  html += '</div>';
  document.getElementById('compareContent').innerHTML = html;
}

function toggleCompareSection(sectionKey) {
  compareState.expandedSections[sectionKey] = !compareState.expandedSections[sectionKey];
  renderComparePage();
}

function removeCompareArea(index) {
  if (compareState.selectedAreas.length <= 1) return;
  compareState.selectedAreas.splice(index, 1);
  renderComparePage();
}

function addCompareArea(districtIdx) {
  if (compareState.selectedAreas.indexOf(districtIdx) >= 0) return;
  compareState.selectedAreas.push(districtIdx);
  hideCompareAddPicker();
  renderComparePage();
}

function showCompareAddPicker() {
  var html = '<div class="compare-add-title">选择服务区</div>';
  for (var i = 0; i < CITY_DATA.districts.length; i++) {
    var inList = compareState.selectedAreas.indexOf(i) >= 0;
    html += '<div class="compare-add-item' + (inList ? ' disabled' : '') + '" data-add-district="' + i + '">'
      + '<span>' + CITY_DATA.districts[i].name + '</span>'
      + (inList ? '<span class="compare-add-check">✓</span>' : '')
      + '</div>';
  }
  document.getElementById('compareAddPanel').innerHTML = html;
  document.getElementById('compareAddOverlay').classList.add('open');
  document.getElementById('compareAddPanel').classList.add('open');
}

function hideCompareAddPicker() {
  document.getElementById('compareAddOverlay').classList.remove('open');
  document.getElementById('compareAddPanel').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('landingHotspot').addEventListener('click', function() {
    document.getElementById('landingPage').style.display = 'none';
    compareState.open = true;
    document.getElementById('comparePage').classList.add('open');
    renderComparePage();
  });

  document.getElementById('compareContent').addEventListener('click', function(e) {
    var sectionHeader = e.target.closest('.compare-section-header');
    if (sectionHeader) {
      toggleCompareSection(sectionHeader.getAttribute('data-compare-section'));
      return;
    }
    var removeBtn = e.target.closest('.compare-area-remove');
    if (removeBtn) {
      removeCompareArea(parseInt(removeBtn.getAttribute('data-remove-area')));
      return;
    }
    var addBtn = e.target.closest('.compare-add-cell');
    if (addBtn) {
      showCompareAddPicker();
      return;
    }
  });

  document.getElementById('compareAddOverlay').addEventListener('click', hideCompareAddPicker);
  document.getElementById('compareAddPanel').addEventListener('click', function(e) {
    var item = e.target.closest('.compare-add-item');
    if (item && !item.classList.contains('disabled')) {
      addCompareArea(parseInt(item.getAttribute('data-add-district')));
    }
  });
});
