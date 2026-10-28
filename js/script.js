const sampleChildren = [
  { id: 1, firstName: "Марія", lastName: "Коваль", middleName: "Олександрівна", birthDate: "2014-05-12", gender: "female", notes: "Захоплюється малюванням." },
  { id: 2, firstName: "Андрій", lastName: "Шевченко", middleName: "Ігорович", birthDate: "2013-09-03", gender: "male", notes: "Любить футбол." },
  { id: 3, firstName: "Софія", lastName: "Мельник", middleName: "Романівна", birthDate: "2015-01-27", gender: "female", notes: "Відвідує гурток робототехніки." },
];

const sampleParents = [
  { id: 1, firstName: "Олена", lastName: "Коваль", middleName: "Петрівна", phone: "+380501234567", email: "olena.koval@example.com", relationship: "mother" },
  { id: 2, firstName: "Ігор", lastName: "Шевченко", middleName: "Васильович", phone: "+380671234568", email: "ihor.shevchenko@example.com", relationship: "father" },
  { id: 3, firstName: "Роман", lastName: "Мельник", middleName: "Тарасович", phone: "+380931234569", email: "roman.melnyk@example.com", relationship: "father" },
];

const sampleCampShifts = [
  { id: 1, name: "Літня пригода", startDate: "2026-06-15", endDate: "2026-06-28", price: 18000, capacity: 40, description: "Ігри на свіжому повітрі, походи та командні завдання." },
  { id: 2, name: "Творча майстерня", startDate: "2026-07-05", endDate: "2026-07-18", price: 19500, capacity: 32, description: "Малювання, музика, театр і творчі проєкти." },
  { id: 3, name: "Науковий старт", startDate: "2026-07-25", endDate: "2026-08-07", price: 21000, capacity: 30, description: "Експерименти, робототехніка та знайомство з наукою." },
];

const sampleBookings = [
  { id: 1, parentId: 1, childId: 1, shiftId: 1, createdAt: "2026-03-10T09:30:00", status: "confirmed", paymentStatus: "paid", comment: "Потрібне вегетаріанське меню." },
  { id: 2, parentId: 2, childId: 2, shiftId: 2, createdAt: "2026-03-12T14:15:00", status: "pending", paymentStatus: "partially_paid", comment: "Решту суми буде сплачено до початку зміни." },
  { id: 3, parentId: 3, childId: 3, shiftId: 3, createdAt: "2026-03-15T11:00:00", status: "new", paymentStatus: "unpaid", comment: "" },
];

const STORAGE_KEYS = {
  children: "campBooking.children",
  parents: "campBooking.parents",
  campShifts: "campBooking.campShifts",
  bookings: "campBooking.bookings",
};

const RECORD_ARRAYS = {
  children: sampleChildren,
  parents: sampleParents,
  campShifts: sampleCampShifts,
  bookings: sampleBookings,
};

const REQUIRED_RECORD_FIELDS = {
  children: ["id", "firstName", "lastName", "birthDate", "gender"],
  parents: ["id", "firstName", "lastName", "phone", "email", "relationship"],
  campShifts: ["id", "name", "startDate", "endDate", "price", "capacity"],
  bookings: ["id", "parentId", "childId", "shiftId", "createdAt", "status", "paymentStatus"],
};

function isValidRecordArray(entity, value) {
  return Array.isArray(value) && value.every((record) =>
    record !== null && typeof record === "object" && !Array.isArray(record) &&
    REQUIRED_RECORD_FIELDS[entity].every((field) =>
      Object.prototype.hasOwnProperty.call(record, field) && record[field] !== null && record[field] !== "",
    ),
  );
}

function initializeRecords() {
  const records = {};
  let storage;

  try {
    storage = window.localStorage;
    // Accessing the property itself may throw in restricted browser contexts.
    storage.getItem(STORAGE_KEYS.children);
  } catch {
    return { ...RECORD_ARRAYS, storageAvailable: false };
  }

  for (const [entity, key] of Object.entries(STORAGE_KEYS)) {
    try {
      const savedValue = storage.getItem(key);
      if (savedValue === null) {
        records[entity] = RECORD_ARRAYS[entity];
        storage.setItem(key, JSON.stringify(records[entity]));
        continue;
      }

      const parsed = JSON.parse(savedValue);
      if (isValidRecordArray(entity, parsed)) {
        records[entity] = parsed;
      } else {
        records[entity] = RECORD_ARRAYS[entity];
        storage.setItem(key, JSON.stringify(records[entity]));
      }
    } catch {
      // A broken key must not prevent loading the other entities.
      records[entity] = RECORD_ARRAYS[entity];
      try {
        storage.setItem(key, JSON.stringify(records[entity]));
      } catch {
        return { ...RECORD_ARRAYS, ...records, storageAvailable: false };
      }
    }
  }

  return { ...records, storageAvailable: true };
}

const initializedRecords = initializeRecords();
let children = initializedRecords.children;
let parents = initializedRecords.parents;
let campShifts = initializedRecords.campShifts;
let bookings = initializedRecords.bookings;

if (!initializedRecords.storageAvailable) {
  const message = document.createElement("p");
  message.className = "storage-notice";
  message.setAttribute("role", "status");
  message.textContent = "Сховище браузера недоступне. Дані працюватимуть лише до закриття або перезавантаження сторінки.";
  document.querySelector("main")?.prepend(message);
}

const translations = {
  female: "жіноча",
  male: "чоловіча",
  mother: "мати",
  father: "батько",
  confirmed: "підтверджено",
  pending: "очікує підтвердження",
  new: "нове",
  cancelled: "скасовано",
  completed: "завершено",
  paid: "сплачено",
  partially_paid: "сплачено частково",
  unpaid: "не сплачено",
  refunded: "кошти повернено",
};

function readFormValues(form) {
  return Object.fromEntries(
    Array.from(form.elements)
      .filter((field) => field.name && !field.disabled)
      .map((field) => {
        const value = field.value;
        return [field.name, field.type === "number" && value !== "" ? Number(value) : value];
      }),
  );
}

function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function validateRequired(values, fieldNames) {
  return fieldNames.filter((name) => !isRequired(values[name]));
}

function isWithinLength(value, { min, max } = {}) {
  const length = String(value ?? "").trim().length;
  return (min === undefined || length >= min) && (max === undefined || length <= max);
}

function isNumberInRange(value, { min = -Infinity, max = Infinity } = {}) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function generateUniqueId(records) {
  const existingIds = new Set(
    (Array.isArray(records) ? records : []).map((record) => record?.id),
  );

  let id = 1;
  while (existingIds.has(id)) id += 1;
  return id;
}

function formatValue(field, value) {
  if (value === null || value === undefined || value === "") return "—";
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
  if (field === "capacity") {
    return `${new Intl.NumberFormat("uk-UA").format(value)} дітей`;
  }
  return value;
}

function createTable(data, columns) {
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");

  columns.forEach(({ label }) => {
    const header = document.createElement("th");
    header.scope = "col";
    header.textContent = label;
    headerRow.append(header);
  });
  head.append(headerRow);
  table.append(head);

  const body = document.createElement("tbody");
  (Array.isArray(data) ? data : []).forEach((record) => {
    const row = document.createElement("tr");
    columns.forEach(({ value, field }) => {
      const cell = document.createElement("td");
      const cellValue = typeof value === "function" ? value(record) : record?.[value];
      cell.textContent = formatValue(field ?? (typeof value === "string" ? value : ""), cellValue);
      row.append(cell);
    });
    body.append(row);
  });
  table.append(body);
  return table;
}

const fullName = (person) => [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "—";
function findById(records, id) {
  return (Array.isArray(records) ? records : []).find((record) => record?.id === id);
}

const columns = {
  children: [
    { label: "№", value: "id" }, { label: "Ім’я", value: "firstName" },
    { label: "Прізвище", value: "lastName" }, { label: "По-батькові", value: "middleName" },
    { label: "Дата народження", value: "birthDate" }, { label: "Стать", value: "gender" },
    { label: "Примітки", value: "notes" },
  ],
  parents: [
    { label: "№", value: "id" }, { label: "Ім’я", value: "firstName" },
    { label: "Прізвище", value: "lastName" }, { label: "По-батькові", value: "middleName" },
    { label: "Телефон", value: "phone" }, { label: "Електронна пошта", value: "email" },
    { label: "Ким доводиться", value: "relationship" },
  ],
  campShifts: [
    { label: "№", value: "id" }, { label: "Назва", value: "name" },
    { label: "Дата початку", value: "startDate" }, { label: "Дата завершення", value: "endDate" },
    { label: "Вартість", value: "price" }, { label: "Місткість", value: "capacity" },
    { label: "Опис", value: "description" },
  ],
  bookings: [
    { label: "№", value: "id" },
    { label: "Дитина", value: (booking) => fullName(findById(children, booking?.childId)) },
    { label: "Представник", value: (booking) => fullName(findById(parents, booking?.parentId)) },
    { label: "Зміна", value: (booking) => findById(campShifts, booking?.shiftId)?.name },
    { label: "Дати зміни", value: (booking) => {
      const shift = findById(campShifts, booking?.shiftId);
      return shift
        ? `${formatValue("startDate", shift.startDate)} – ${formatValue("endDate", shift.endDate)}`
        : "—";
    } },
    { label: "Створено", value: "createdAt" }, { label: "Статус", value: "status" },
    { label: "Оплата", value: "paymentStatus" }, { label: "Коментар", value: "comment" },
  ],
};

const tableConfigs = [
  { rows: children, containerId: "children-table", columns: columns.children },
  { rows: parents, containerId: "parents-table", columns: columns.parents },
  { rows: campShifts, containerId: "camp-shifts-table", columns: columns.campShifts },
  { rows: bookings, containerId: "bookings-table", columns: columns.bookings },
];

tableConfigs.forEach(({ rows, containerId, columns: tableColumns }) => {
  const container = document.getElementById(containerId);
  if (container) container.append(createTable(rows, tableColumns));
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
