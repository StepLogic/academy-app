import moment from "moment";
import { filter } from "lodash";
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
export const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * It returns an array of 14 strings, each string representing a time in the format of "HH:mm" starting
 * from 8:00am
 * @returns An array of strings, each string representing a time in the format HH:mm.
 */
export const getTime = () => {
  const time = moment({ hour: 8 });
  return Array(14)
    .fill(0)
    .map((i, idx) => time.clone().add(idx, "hour").format("HH:mm"));
};
/**
 * It takes an array of objects, and returns true if the array contains at least 3 unique values of a
 * specific property
 * @param {SelectedSlot[]} values - SelectedSlot[] - This is the array of selected slots.
 * @returns A function that takes in an array of SelectedSlot objects and returns a boolean.
 */
export const validateSlots = (values) => {
  const numberOfAvailableSlots = values.filter(
    (r) => r.isSelected === false
  ).length;
  //
  if (numberOfAvailableSlots >= 12) {
    let daysSelected = [];
    values.forEach((item) => {
      if (!daysSelected.includes(item.value.day) && !item.isSelected) {
        daysSelected.push(item.value.day);
      }
    });
    return daysSelected.length >= 3;
  }
  return false;
};
// export const generateSlots = () => {
//   const times = getTime();
//   const arr = Array.from({ length: 14 }, (_, i) => {
//     return Array.from({ length: 7 }, (_r, j) => {
//       return {
//         value: { day: Days[j], time: times[i] },
//         isSelected: excludeDate({
//           day: Days[j],
//           time: times[i],
//         }),
//         id: "slot" + Days[j] + times[i],
//       };
//     });
//   });
//   return arr;
// };
export const updateValue = (r, id) => {
  const v = r.map((k: any) => {
    if (k.id == id) {
      k.isSelected = !k.isSelected;
    }
    return k;
  });

  return v;
};
export const generateSlotsExistingAvailabilities = (data) => {
  if (data[0]?.Stringa[0] === null) return generateSlots();
  const arr = data[0]?.Stringa.map((a, idx) => {
    let data_time = a.id.split(" ");
    const value = {
      value: { day: Days[data_time[2]], time: data_time[1] - 1 },
      isSelected: !Boolean(a.status),
      id: "slot" + idx,
    };
    return value;
  });

  return arr;
};
export const excludeDate = (value: any) => {
  const excludeTimes = ["19:00", "20:00", "21:00"];
  if (value.day === "Sun" || value.day === "Sat") {
    return excludeTimes.includes(value.time);
  }
  return false;
};

export const generateSlots = () => {
  const times = getTime();
  const arr = Array.from({ length: 98 }, (_, i) => {
    const value = {
      value: { day: Days[i % 7], time: times[Math.floor(i / 7)] },
      isSelected: excludeDate({
        day: Days[i % 7],
        time: times[Math.floor(i / 7)],
      }),
      id: "slot" + i,
    };
    return value;
  });
  return arr;
};

export const slots = [
  [
    {
      value: {
        day: "Mon",
        time: "08:00",
      },
      isSelected: false,
      id: "slotMon08:00",
    },
    {
      value: {
        day: "Tue",
        time: "08:00",
      },
      isSelected: false,
      id: "slotTue08:00",
    },
    {
      value: {
        day: "Wed",
        time: "08:00",
      },
      isSelected: false,
      id: "slotWed08:00",
    },
    {
      value: {
        day: "Thu",
        time: "08:00",
      },
      isSelected: false,
      id: "slotThu08:00",
    },
    {
      value: {
        day: "Fri",
        time: "08:00",
      },
      isSelected: false,
      id: "slotFri08:00",
    },
    {
      value: {
        day: "Sat",
        time: "08:00",
      },
      isSelected: false,
      id: "slotSat08:00",
    },
    {
      value: {
        day: "Sun",
        time: "08:00",
      },
      isSelected: false,
      id: "slotSun08:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "09:00",
      },
      isSelected: false,
      id: "slotMon09:00",
    },
    {
      value: {
        day: "Tue",
        time: "09:00",
      },
      isSelected: false,
      id: "slotTue09:00",
    },
    {
      value: {
        day: "Wed",
        time: "09:00",
      },
      isSelected: false,
      id: "slotWed09:00",
    },
    {
      value: {
        day: "Thu",
        time: "09:00",
      },
      isSelected: false,
      id: "slotThu09:00",
    },
    {
      value: {
        day: "Fri",
        time: "09:00",
      },
      isSelected: false,
      id: "slotFri09:00",
    },
    {
      value: {
        day: "Sat",
        time: "09:00",
      },
      isSelected: false,
      id: "slotSat09:00",
    },
    {
      value: {
        day: "Sun",
        time: "09:00",
      },
      isSelected: false,
      id: "slotSun09:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "10:00",
      },
      isSelected: false,
      id: "slotMon10:00",
    },
    {
      value: {
        day: "Tue",
        time: "10:00",
      },
      isSelected: false,
      id: "slotTue10:00",
    },
    {
      value: {
        day: "Wed",
        time: "10:00",
      },
      isSelected: false,
      id: "slotWed10:00",
    },
    {
      value: {
        day: "Thu",
        time: "10:00",
      },
      isSelected: false,
      id: "slotThu10:00",
    },
    {
      value: {
        day: "Fri",
        time: "10:00",
      },
      isSelected: false,
      id: "slotFri10:00",
    },
    {
      value: {
        day: "Sat",
        time: "10:00",
      },
      isSelected: false,
      id: "slotSat10:00",
    },
    {
      value: {
        day: "Sun",
        time: "10:00",
      },
      isSelected: false,
      id: "slotSun10:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "11:00",
      },
      isSelected: false,
      id: "slotMon11:00",
    },
    {
      value: {
        day: "Tue",
        time: "11:00",
      },
      isSelected: false,
      id: "slotTue11:00",
    },
    {
      value: {
        day: "Wed",
        time: "11:00",
      },
      isSelected: false,
      id: "slotWed11:00",
    },
    {
      value: {
        day: "Thu",
        time: "11:00",
      },
      isSelected: false,
      id: "slotThu11:00",
    },
    {
      value: {
        day: "Fri",
        time: "11:00",
      },
      isSelected: false,
      id: "slotFri11:00",
    },
    {
      value: {
        day: "Sat",
        time: "11:00",
      },
      isSelected: false,
      id: "slotSat11:00",
    },
    {
      value: {
        day: "Sun",
        time: "11:00",
      },
      isSelected: false,
      id: "slotSun11:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "12:00",
      },
      isSelected: false,
      id: "slotMon12:00",
    },
    {
      value: {
        day: "Tue",
        time: "12:00",
      },
      isSelected: false,
      id: "slotTue12:00",
    },
    {
      value: {
        day: "Wed",
        time: "12:00",
      },
      isSelected: false,
      id: "slotWed12:00",
    },
    {
      value: {
        day: "Thu",
        time: "12:00",
      },
      isSelected: false,
      id: "slotThu12:00",
    },
    {
      value: {
        day: "Fri",
        time: "12:00",
      },
      isSelected: false,
      id: "slotFri12:00",
    },
    {
      value: {
        day: "Sat",
        time: "12:00",
      },
      isSelected: false,
      id: "slotSat12:00",
    },
    {
      value: {
        day: "Sun",
        time: "12:00",
      },
      isSelected: false,
      id: "slotSun12:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "13:00",
      },
      isSelected: false,
      id: "slotMon13:00",
    },
    {
      value: {
        day: "Tue",
        time: "13:00",
      },
      isSelected: false,
      id: "slotTue13:00",
    },
    {
      value: {
        day: "Wed",
        time: "13:00",
      },
      isSelected: false,
      id: "slotWed13:00",
    },
    {
      value: {
        day: "Thu",
        time: "13:00",
      },
      isSelected: false,
      id: "slotThu13:00",
    },
    {
      value: {
        day: "Fri",
        time: "13:00",
      },
      isSelected: false,
      id: "slotFri13:00",
    },
    {
      value: {
        day: "Sat",
        time: "13:00",
      },
      isSelected: false,
      id: "slotSat13:00",
    },
    {
      value: {
        day: "Sun",
        time: "13:00",
      },
      isSelected: false,
      id: "slotSun13:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "14:00",
      },
      isSelected: false,
      id: "slotMon14:00",
    },
    {
      value: {
        day: "Tue",
        time: "14:00",
      },
      isSelected: false,
      id: "slotTue14:00",
    },
    {
      value: {
        day: "Wed",
        time: "14:00",
      },
      isSelected: false,
      id: "slotWed14:00",
    },
    {
      value: {
        day: "Thu",
        time: "14:00",
      },
      isSelected: false,
      id: "slotThu14:00",
    },
    {
      value: {
        day: "Fri",
        time: "14:00",
      },
      isSelected: false,
      id: "slotFri14:00",
    },
    {
      value: {
        day: "Sat",
        time: "14:00",
      },
      isSelected: false,
      id: "slotSat14:00",
    },
    {
      value: {
        day: "Sun",
        time: "14:00",
      },
      isSelected: false,
      id: "slotSun14:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "15:00",
      },
      isSelected: false,
      id: "slotMon15:00",
    },
    {
      value: {
        day: "Tue",
        time: "15:00",
      },
      isSelected: false,
      id: "slotTue15:00",
    },
    {
      value: {
        day: "Wed",
        time: "15:00",
      },
      isSelected: false,
      id: "slotWed15:00",
    },
    {
      value: {
        day: "Thu",
        time: "15:00",
      },
      isSelected: false,
      id: "slotThu15:00",
    },
    {
      value: {
        day: "Fri",
        time: "15:00",
      },
      isSelected: false,
      id: "slotFri15:00",
    },
    {
      value: {
        day: "Sat",
        time: "15:00",
      },
      isSelected: false,
      id: "slotSat15:00",
    },
    {
      value: {
        day: "Sun",
        time: "15:00",
      },
      isSelected: false,
      id: "slotSun15:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "16:00",
      },
      isSelected: false,
      id: "slotMon16:00",
    },
    {
      value: {
        day: "Tue",
        time: "16:00",
      },
      isSelected: false,
      id: "slotTue16:00",
    },
    {
      value: {
        day: "Wed",
        time: "16:00",
      },
      isSelected: false,
      id: "slotWed16:00",
    },
    {
      value: {
        day: "Thu",
        time: "16:00",
      },
      isSelected: false,
      id: "slotThu16:00",
    },
    {
      value: {
        day: "Fri",
        time: "16:00",
      },
      isSelected: false,
      id: "slotFri16:00",
    },
    {
      value: {
        day: "Sat",
        time: "16:00",
      },
      isSelected: false,
      id: "slotSat16:00",
    },
    {
      value: {
        day: "Sun",
        time: "16:00",
      },
      isSelected: false,
      id: "slotSun16:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "17:00",
      },
      isSelected: false,
      id: "slotMon17:00",
    },
    {
      value: {
        day: "Tue",
        time: "17:00",
      },
      isSelected: false,
      id: "slotTue17:00",
    },
    {
      value: {
        day: "Wed",
        time: "17:00",
      },
      isSelected: false,
      id: "slotWed17:00",
    },
    {
      value: {
        day: "Thu",
        time: "17:00",
      },
      isSelected: false,
      id: "slotThu17:00",
    },
    {
      value: {
        day: "Fri",
        time: "17:00",
      },
      isSelected: false,
      id: "slotFri17:00",
    },
    {
      value: {
        day: "Sat",
        time: "17:00",
      },
      isSelected: false,
      id: "slotSat17:00",
    },
    {
      value: {
        day: "Sun",
        time: "17:00",
      },
      isSelected: false,
      id: "slotSun17:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "18:00",
      },
      isSelected: false,
      id: "slotMon18:00",
    },
    {
      value: {
        day: "Tue",
        time: "18:00",
      },
      isSelected: false,
      id: "slotTue18:00",
    },
    {
      value: {
        day: "Wed",
        time: "18:00",
      },
      isSelected: false,
      id: "slotWed18:00",
    },
    {
      value: {
        day: "Thu",
        time: "18:00",
      },
      isSelected: false,
      id: "slotThu18:00",
    },
    {
      value: {
        day: "Fri",
        time: "18:00",
      },
      isSelected: false,
      id: "slotFri18:00",
    },
    {
      value: {
        day: "Sat",
        time: "18:00",
      },
      isSelected: false,
      id: "slotSat18:00",
    },
    {
      value: {
        day: "Sun",
        time: "18:00",
      },
      isSelected: false,
      id: "slotSun18:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "19:00",
      },
      isSelected: false,
      id: "slotMon19:00",
    },
    {
      value: {
        day: "Tue",
        time: "19:00",
      },
      isSelected: false,
      id: "slotTue19:00",
    },
    {
      value: {
        day: "Wed",
        time: "19:00",
      },
      isSelected: false,
      id: "slotWed19:00",
    },
    {
      value: {
        day: "Thu",
        time: "19:00",
      },
      isSelected: false,
      id: "slotThu19:00",
    },
    {
      value: {
        day: "Fri",
        time: "19:00",
      },
      isSelected: false,
      id: "slotFri19:00",
    },
    {
      value: {
        day: "Sat",
        time: "19:00",
      },
      isSelected: true,
      id: "slotSat19:00",
    },
    {
      value: {
        day: "Sun",
        time: "19:00",
      },
      isSelected: true,
      id: "slotSun19:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "20:00",
      },
      isSelected: false,
      id: "slotMon20:00",
    },
    {
      value: {
        day: "Tue",
        time: "20:00",
      },
      isSelected: false,
      id: "slotTue20:00",
    },
    {
      value: {
        day: "Wed",
        time: "20:00",
      },
      isSelected: false,
      id: "slotWed20:00",
    },
    {
      value: {
        day: "Thu",
        time: "20:00",
      },
      isSelected: false,
      id: "slotThu20:00",
    },
    {
      value: {
        day: "Fri",
        time: "20:00",
      },
      isSelected: false,
      id: "slotFri20:00",
    },
    {
      value: {
        day: "Sat",
        time: "20:00",
      },
      isSelected: true,
      id: "slotSat20:00",
    },
    {
      value: {
        day: "Sun",
        time: "20:00",
      },
      isSelected: true,
      id: "slotSun20:00",
    },
  ],
  [
    {
      value: {
        day: "Mon",
        time: "21:00",
      },
      isSelected: false,
      id: "slotMon21:00",
    },
    {
      value: {
        day: "Tue",
        time: "21:00",
      },
      isSelected: false,
      id: "slotTue21:00",
    },
    {
      value: {
        day: "Wed",
        time: "21:00",
      },
      isSelected: false,
      id: "slotWed21:00",
    },
    {
      value: {
        day: "Thu",
        time: "21:00",
      },
      isSelected: false,
      id: "slotThu21:00",
    },
    {
      value: {
        day: "Fri",
        time: "21:00",
      },
      isSelected: false,
      id: "slotFri21:00",
    },
    {
      value: {
        day: "Sat",
        time: "21:00",
      },
      isSelected: true,
      id: "slotSat21:00",
    },
    {
      value: {
        day: "Sun",
        time: "21:00",
      },
      isSelected: true,
      id: "slotSun21:00",
    },
  ],
];
