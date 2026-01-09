export const formatFullDate = (value: any) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDate = (value: any) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getFullYear = (value: number) => {
  const date = new Date(value);
  const year = date.getFullYear();
  return year;
}

export const getMonth = (value:any) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}
export const formatHmsDate = (value: any) => {
  const date = new Date(value);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
// 获取两个日期之间的分钟差，保留两位小数
export const getMinutesDiffPrecise = (date1:any, date2:any) => {
    const diffInMs = date2 - date1;
    return (diffInMs / (1000 * 60)).toFixed(2); // 保留两位小数
}
// 获取两个时间戳之间的小时差，保留两位小数
export const getHourDifference = (timestamp1:any, timestamp2:any) => {
    const diffInMs = Math.abs(timestamp2 - timestamp1);    
    // 将毫秒转换为小时（1小时 = 1000ms * 60s * 60min）
    const diffInHours = diffInMs / (1000 * 60 * 60);    
    // 保留两位小数
    return Math.round(diffInHours * 100) / 100;
}


// 获取指定年月的起始和结束日期，格式为YYYY-MM-DD
export const getMonthDateRange = (yearMonth:any) => {
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(5, 7), 10);
  // 当月第一天（月份从0开始计数）
  const startDate = new Date(year, month - 1, 1);
  // 下个月第0天即为当月最后一天
  const endDate = new Date(year, month, 0);
  const formatDate = (date:any) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return [`${formatDate(startDate)}`,`${formatDate(endDate)}`];
}

