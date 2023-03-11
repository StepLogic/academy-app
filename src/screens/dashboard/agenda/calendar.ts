import moment, { Moment } from "moment";
/* Creating an array of months. */
export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/* Creating an array of days of the week. */
export const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const getDate = (date: Moment) => {
  var calendar = [];
  const startDate = date.clone().startOf("month").startOf("isoWeek");
  const endDate = date.clone().endOf("month");
  const day = startDate.clone().subtract(1, "day");
  while (day.isBefore(endDate, "day")) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => day.add(1, "day").clone().format("DD-MM-YYYY"))
    );
  }
  const m = moment();
  if (calendar.length > 5) {
    if (m.date() >= 23) {
      return calendar.slice(1);
    } else {
      calendar.pop();
    }
  }
  return calendar;
};
// export const getDateTruncated = (date: Moment) => {
//   var calendar = [];
//   const startDate = date.clone().startOf("month").startOf("isoWeek");
//   const endDate = date.clone().add(1, "month").endOf("month");
//   const day: Moment = startDate.clone().subtract(1, "day");
//   while (day.isBefore(endDate, "day")) {
//     const month: { month: Moment; days: Array<string> } = {
//       month: day,
//       days: [],
//     };
//     while (day.isSame(month.month, "month")) {
//       month.days.push(day.add(1, "day").clone().format("DD-MM-YYYY"));
//     }
//     calendar.push(month);
//   }
//   return calendar;
// };
export const getDateTruncated = (date: Moment) => {
  const startDate = date.clone().startOf("month");
  const endDate = date.clone().endOf("month");
  const day: Moment = startDate.clone().subtract(1, "day");
  const month: { title: Moment; data: Array<Moment> } = {
    title: day,
    data: [],
  };
  while (day.isBefore(endDate, "day")) {
    month.data.push(day.add(1, "day").clone());
  }
  return month;
};
export const getDateTruncatedFlashList = (date: Moment) => {
  const startDate = date.clone().startOf("month");
  const endDate = date.clone().endOf("month");
  const day: Moment = startDate.clone().subtract(1, "day");
  const month: Array<any> = [startDate.format("DD-MM-YYYY")];
  while (day.isBefore(endDate, "day")) {
    month.push({ day: day.add(1, "day").clone().format("DD-MM-YYYY") });
  }
  // console.log("month", month);
  return month;
};
//fix mobile
/**
 * It takes two dates, one for the start of the month and one for the end of the month, and returns an
 * array of arrays of strings, where each string is a date in the format DD-MM-YYYY
 * @param {Moment} startDate - Moment - The start date of the calendar
 * @param {Moment} endDate - Moment - The end date of the calendar
 * @returns An array of arrays of strings.
 */

// export const getDateBetween = (startDate: Moment, endDate: Moment) =>
//   new Promise((resolve, reject) => {
//     var calendar = [];
//     const _startDate = startDate.clone().startOf("month").startOf("isoWeek");
//     const _endDate = endDate.clone().endOf("month");
//     const day = _startDate.clone().subtract(1, "day");
//     while (day.isBefore(_endDate, "day")) {
//       calendar.push(day.add(1, "day").clone().format("DD-MM-YYYY"));
//     }
//     resolve(calendar);
//   });
export const getDateBetween = () => {
  let startDate = moment("1", "D");

  let todayIndex = 0;
  let idx = 0;
  var calendar = [];
  const _startDate = startDate.clone().startOf("month");
  const _endDate = startDate.clone().endOf("month");
  const day = _startDate.clone().subtract(1, "day");
  while (day.isBefore(_endDate, "day")) {
    if (day.isSame(moment(), "day")) {
      todayIndex = idx;
    } else {
      ++idx;
    }
    calendar.push(day.add(1, "day").clone().format("DD-MM-YYYY"));
  }
  return { calendar, todayIndex };
};
// export const getDateBetween = () => {
//   let startDate = moment("1", "D");
//   console.log("start-date", startDate.format("DD-MM-YYYY"));
//   startDate.subtract(1, "month");
//   console.log("start-date", startDate.format("DD-MM-YYYY"));
//   let endDate = moment("1", "D");
//   console.log("end-date", endDate.format("DD-MM-YYYY"));
//   endDate.add(1, "month");
//   console.log("end-date", endDate.format("DD-MM-YYYY"));
//   let todayIndex = 0;
//   let idx = 0;
//   var calendar = [];
//   const _startDate = startDate.clone().startOf("month");
//   const _endDate = endDate.clone().startOf("month");
//   const day = _startDate.clone().subtract(1, "day");
//   while (day.isBefore(_endDate, "day")) {
//     if (day.isSame(moment(), "day")) {
//       todayIndex = idx;
//     } else {
//       ++idx;
//     }
//     calendar.push(day.add(1, "day").clone().format("DD-MM-YYYY"));
//   }
//   return { calendar, todayIndex };
// };
