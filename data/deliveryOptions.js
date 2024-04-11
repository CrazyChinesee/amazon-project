import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}
//There is a bug when you place an order on weekends
export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs().add(0, "day"); //Play with todayDate
  let dayInWeek = dayjs().add(0, "day");
  let requestedDays = deliveryOption.deliveryDays;
  let counterDays = 0;

  while (requestedDays > 0) {
    if (ifWeekend(dayInWeek)) {
      //Shouldnt add counter days every time rather set value

      counterDays++;
      dayInWeek = today.add(counterDays, "day");
    } else {
      requestedDays--;

      counterDays++;
      dayInWeek = today.add(counterDays, "day");
      if (ifWeekend(dayInWeek)) {
        //When loop ends on weekend(sat)
        counterDays++;
        dayInWeek = today.add(counterDays, "day");
      }
      if (ifWeekend(dayInWeek)) {
        //when loops ends on weekend(sun)
        counterDays++;
        dayInWeek = today.add(counterDays, "day");
      }
    }
  }

  const deliveryDate = today.add(counterDays, "day");

  const dateString = deliveryDate.format("dddd, MMMM D");

  return dateString;
}

function ifWeekend(date) {
  const dayOfWeek = date.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}
