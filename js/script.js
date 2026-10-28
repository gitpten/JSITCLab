const children = [
  {
    id: 1,
    firstName: "Марія",
    lastName: "Коваль",
    middleName: "Олександрівна",
    birthDate: "2014-05-12",
    gender: "female",
    notes: "Захоплюється малюванням.",
  },
  {
    id: 2,
    firstName: "Андрій",
    lastName: "Шевченко",
    middleName: "Ігорович",
    birthDate: "2013-09-03",
    gender: "male",
    notes: "Любить футбол.",
  },
  {
    id: 3,
    firstName: "Софія",
    lastName: "Мельник",
    middleName: "Романівна",
    birthDate: "2015-01-27",
    gender: "female",
    notes: "Відвідує гурток робототехніки.",
  },
];

const parents = [
  {
    id: 1,
    firstName: "Олена",
    lastName: "Коваль",
    middleName: "Петрівна",
    phone: "+380501234567",
    email: "olena.koval@example.com",
    relationship: "mother",
  },
  {
    id: 2,
    firstName: "Ігор",
    lastName: "Шевченко",
    middleName: "Васильович",
    phone: "+380671234568",
    email: "ihor.shevchenko@example.com",
    relationship: "father",
  },
  {
    id: 3,
    firstName: "Роман",
    lastName: "Мельник",
    middleName: "Тарасович",
    phone: "+380931234569",
    email: "roman.melnyk@example.com",
    relationship: "father",
  },
];

const campShifts = [
  {
    id: 1,
    name: "Літня пригода",
    startDate: "2026-06-15",
    endDate: "2026-06-28",
    price: 18000,
    capacity: 40,
    description: "Ігри на свіжому повітрі, походи та командні завдання.",
  },
  {
    id: 2,
    name: "Творча майстерня",
    startDate: "2026-07-05",
    endDate: "2026-07-18",
    price: 19500,
    capacity: 32,
    description: "Малювання, музика, театр і творчі проєкти.",
  },
  {
    id: 3,
    name: "Науковий старт",
    startDate: "2026-07-25",
    endDate: "2026-08-07",
    price: 21000,
    capacity: 30,
    description: "Експерименти, робототехніка та знайомство з наукою.",
  },
];

const bookings = [
  {
    id: 1,
    parentId: 1,
    childId: 1,
    shiftId: 1,
    createdAt: "2026-03-10T09:30:00",
    status: "confirmed",
    paymentStatus: "paid",
    comment: "Потрібне вегетаріанське меню.",
  },
  {
    id: 2,
    parentId: 2,
    childId: 2,
    shiftId: 2,
    createdAt: "2026-03-12T14:15:00",
    status: "pending",
    paymentStatus: "partially_paid",
    comment: "Решту суми буде сплачено до початку зміни.",
  },
  {
    id: 3,
    parentId: 3,
    childId: 3,
    shiftId: 3,
    createdAt: "2026-03-15T11:00:00",
    status: "new",
    paymentStatus: "unpaid",
    comment: "",
  },
];

const tableConfigs = [
  { rows: children, bodyId: "children-table-body", fields: ["id", "firstName", "lastName", "middleName", "birthDate", "gender", "notes"] },
  { rows: parents, bodyId: "parents-table-body", fields: ["id", "firstName", "lastName", "middleName", "phone", "email", "relationship"] },
  { rows: campShifts, bodyId: "camp-shifts-table-body", fields: ["id", "name", "startDate", "endDate", "price", "capacity", "description"] },
  { rows: bookings, bodyId: "bookings-table-body", fields: ["id", "parentId", "childId", "shiftId", "createdAt", "status", "paymentStatus", "comment"] },
];

const translations = {
  female: "жіноча",
  male: "чоловіча",
  mother: "мати",
  father: "батько",
  confirmed: "підтверджено",
  pending: "очікує підтвердження",
  new: "нове",
  paid: "сплачено",
  partially_paid: "сплачено частково",
  unpaid: "не сплачено",
};

function formatValue(field, value) {
  if (!value) return "—";
  if (translations[value]) return translations[value];
  if (["birthDate", "startDate", "endDate"].includes(field)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  if (field === "createdAt") {
    return new Intl.DateTimeFormat("uk-UA", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }
  if (field === "price") {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return value;
}

tableConfigs.forEach(({ rows, bodyId, fields }) => {
  const body = document.getElementById(bodyId);
  rows.forEach((record) => {
    const row = document.createElement("tr");
    fields.forEach((field) => {
      const cell = document.createElement("td");
      cell.textContent = formatValue(field, record[field]);
      row.append(cell);
    });
    body.append(row);
  });
});

const tabs = Array.from(document.querySelectorAll("[role='tab']"));
const panels = Array.from(document.querySelectorAll("[role='tabpanel']"));

function activateTab(selectedTab, moveFocus = false) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== selectedTab.dataset.panel;
  });
  if (moveFocus) selectedTab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    }
  });
});
