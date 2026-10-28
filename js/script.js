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
  guardian: "законний представник",
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

const allowedValues = {
  gender: ["female", "male"],
  relationship: ["mother", "father", "guardian"],
  status: ["new", "pending", "confirmed", "cancelled", "completed"],
  paymentStatus: ["unpaid", "partially_paid", "paid", "refunded"],
};

const requiredFields = {
  child: ["firstName", "lastName", "birthDate", "gender"],
  parent: ["firstName", "lastName", "phone", "email", "relationship"],
  campShift: ["name", "startDate", "endDate", "price", "capacity"],
  booking: ["parentId", "childId", "shiftId", "createdAt", "status", "paymentStatus"],
};

const fieldLabels = {
  firstName: "Ім’я", lastName: "Прізвище", birthDate: "Дата народження", gender: "Стать",
  phone: "Телефон", email: "Електронна пошта", relationship: "Ступінь спорідненості",
  name: "Назва зміни", startDate: "Дата початку", endDate: "Дата завершення",
  price: "Вартість", capacity: "Місткість", parentId: "Законний представник",
  childId: "Дитина", shiftId: "Зміна", createdAt: "Дата створення",
  status: "Статус замовлення", paymentStatus: "Статус оплати",
};

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  if (typeof value !== "string" || !/^\+?[0-9][0-9\s().-]*[0-9]$/.test(value.trim())) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
}

function validateEntity(entity, values, records = {}) {
  const errors = {};
  const addError = (field, message) => { errors[field] = message; };

  if (!requiredFields[entity]) {
    return { isValid: false, errors: { _form: "Невідомий тип запису для перевірки." } };
  }

  validateRequired(values, requiredFields[entity]).forEach((field) => {
    addError(field, `Заповніть поле «${fieldLabels[field] ?? field}».`);
  });

  if (entity === "child") {
    ["firstName", "lastName", "middleName", "notes"].forEach((field) => {
      if (isRequired(values[field]) && !isWithinLength(values[field], { max: field === "notes" ? 1000 : 100 })) {
        addError(field, `Поле «${fieldLabels[field] ?? field}» задовге.`);
      }
    });
    if (isRequired(values.birthDate) && !isValidDate(values.birthDate)) addError("birthDate", "Вкажіть коректну дату народження.");
    if (isRequired(values.gender) && !allowedValues.gender.includes(values.gender)) addError("gender", "Оберіть коректну стать.");
  }

  if (entity === "parent") {
    ["firstName", "lastName", "middleName"].forEach((field) => {
      if (isRequired(values[field]) && !isWithinLength(values[field], { max: 100 })) addError(field, `Поле «${fieldLabels[field]}» задовге.`);
    });
    if (isRequired(values.phone) && !isValidPhone(values.phone)) addError("phone", "Вкажіть коректний номер телефону (від 7 до 15 цифр).");
    if (isRequired(values.email) && !isValidEmail(values.email)) addError("email", "Вкажіть коректну адресу електронної пошти.");
    if (isRequired(values.relationship) && !allowedValues.relationship.includes(values.relationship)) addError("relationship", "Оберіть коректний ступінь спорідненості.");
  }

  if (entity === "campShift") {
    if (isRequired(values.name) && !isWithinLength(values.name, { max: 120 })) addError("name", "Назва зміни не може перевищувати 120 символів.");
    ["startDate", "endDate"].forEach((field) => {
      if (isRequired(values[field]) && !isValidDate(values[field])) addError(field, `Вкажіть коректну дату: «${fieldLabels[field]}».`);
    });
    if (isValidDate(values.startDate) && isValidDate(values.endDate) && values.endDate < values.startDate) {
      addError("endDate", "Дата завершення не може передувати даті початку.");
    }
    if (values.price !== "" && values.price !== null && values.price !== undefined && !isNumberInRange(values.price, { min: 0 })) {
      addError("price", "Вартість має бути числом, більшим або рівним нулю.");
    }
    if (values.capacity !== "" && values.capacity !== null && values.capacity !== undefined) {
      if (!isNumberInRange(values.capacity, { min: 1 }) || !Number.isInteger(values.capacity)) {
        addError("capacity", "Місткість має бути додатним цілим числом.");
      }
    }
    if (isRequired(values.description) && !isWithinLength(values.description, { max: 1000 })) addError("description", "Опис не може перевищувати 1000 символів.");
  }

  if (entity === "booking") {
    const referenceSets = { parentId: records.parents, childId: records.children, shiftId: records.campShifts };
    Object.entries(referenceSets).forEach(([field, items]) => {
      if (isRequired(values[field]) && (!Array.isArray(items) || !items.some((item) => String(item?.id) === String(values[field])))) {
        addError(field, `Обраний запис «${fieldLabels[field]}» не знайдено.`);
      }
    });
    if (isRequired(values.createdAt) && (typeof values.createdAt !== "string" || !Number.isFinite(Date.parse(values.createdAt)))) {
      addError("createdAt", "Вкажіть коректну дату створення замовлення.");
    }
    if (isRequired(values.status) && !allowedValues.status.includes(values.status)) addError("status", "Оберіть коректний статус замовлення.");
    if (isRequired(values.paymentStatus) && !allowedValues.paymentStatus.includes(values.paymentStatus)) addError("paymentStatus", "Оберіть коректний статус оплати.");
    if (isRequired(values.comment) && !isWithinLength(values.comment, { max: 1000 })) addError("comment", "Коментар не може перевищувати 1000 символів.");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
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
  return (Array.isArray(records) ? records : []).find((record) => String(record?.id) === String(id));
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

function renderTable(containerId, rows, tableColumns) {
  const container = document.getElementById(containerId);
  if (container) container.replaceChildren(createTable(rows, tableColumns));
}

const formSubmissionsInProgress = new WeakSet();

function refreshBookingSelectors() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const selectors = [
    { name: "childId", records: children, placeholder: "Оберіть дитину", label: (child) => fullName(child) },
    { name: "parentId", records: parents, placeholder: "Оберіть законного представника", label: (parent) => fullName(parent) },
    { name: "shiftId", records: campShifts, placeholder: "Оберіть зміну", label: (shift) => `${shift.name} (${formatValue("startDate", shift.startDate)} – ${formatValue("endDate", shift.endDate)})` },
  ];

  selectors.forEach(({ name, records, placeholder, label }) => {
    const select = form.elements.namedItem(name);
    const selectedValue = select.value;
    select.replaceChildren(new Option(records.length ? placeholder : "Немає доступних записів", ""));
    records.forEach((record) => select.add(new Option(label(record), String(record.id))));
    select.value = records.some((record) => String(record.id) === selectedValue) ? selectedValue : "";
    select.disabled = records.length === 0;
  });

  const unavailable = selectors.some(({ records }) => records.length === 0);
  form.querySelector("button[type='submit']").disabled = unavailable;
  const message = document.getElementById("booking-form-message");
  if (unavailable) {
    message.textContent = "Спочатку додайте дитину, представника та зміну, щоб оформити бронювання.";
    message.classList.add("is-error");
  } else if (message.textContent.startsWith("Спочатку додайте")) {
    message.textContent = "";
    message.classList.remove("is-error");
  }
}

function createRecord({ entity, records, record, form, tableId, tableColumns, message, successText }) {
  if (formSubmissionsInProgress.has(form)) return false;
  formSubmissionsInProgress.add(form);
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const key = STORAGE_KEYS[entity];
    if (!key || records.some((existing) => String(existing?.id) === String(record.id))) {
      throw new Error("Не вдалося підготувати унікальний запис.");
    }

    // Записуємо новий стан до localStorage до зміни масиву: якщо збереження
    // завершиться помилкою, дані в пам’яті залишаться незмінними.
    try {
      window.localStorage.setItem(key, JSON.stringify([...records, record]));
    } catch {
      message.textContent = "Не вдалося зберегти запис у сховище браузера. Перевірте доступ до localStorage і спробуйте ще раз.";
      message.classList.remove("is-success");
      message.classList.add("is-error");
      return false;
    }

    records.push(record);
    renderTable(tableId, records, tableColumns);
    if (["children", "parents", "campShifts"].includes(entity)) refreshBookingSelectors();
    form.reset();
    message.textContent = successText;
    message.classList.remove("is-error");
    message.classList.add("is-success");
    return true;
  } finally {
    formSubmissionsInProgress.delete(form);
    submitButton.disabled = false;
  }
}

tableConfigs.forEach(({ rows, containerId, columns: tableColumns }) => {
  renderTable(containerId, rows, tableColumns);
});

const childForm = document.getElementById("child-form");
  if (childForm) {
  const childFormMessage = document.getElementById("child-form-message");

  childForm.addEventListener("submit", (event) => {
    event.preventDefault();
    childFormMessage.textContent = "";
    childFormMessage.classList.remove("is-success", "is-error");
    childForm.querySelectorAll(".field-error").forEach((message) => { message.textContent = ""; });
    childForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    const values = readFormValues(childForm);
    const validation = validateEntity("child", values);
    if (!validation.isValid) {
      Object.entries(validation.errors).forEach(([name, message]) => {
        const fieldMessage = document.getElementById(`${name}-error`);
        const field = childForm.elements.namedItem(name);
        if (fieldMessage) fieldMessage.textContent = message;
        if (field && "setAttribute" in field) field.setAttribute("aria-invalid", "true");
      });
      childFormMessage.textContent = "Перевірте позначені поля та виправте помилки.";
      childFormMessage.classList.add("is-error");
      const firstInvalidField = childForm.querySelector("[aria-invalid='true']");
      firstInvalidField?.focus();
      return;
    }

    const child = {
      id: generateUniqueId(children),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName.trim(),
      birthDate: values.birthDate,
      gender: values.gender,
      notes: values.notes.trim(),
    };
    createRecord({
      entity: "children", records: children, record: child, form: childForm,
      tableId: "children-table", tableColumns: columns.children, message: childFormMessage,
      successText: `Запис «${[child.firstName, child.middleName, child.lastName].filter(Boolean).join(" ")}» збережено.`,
    });
  });
}

const parentForm = document.getElementById("parent-form");
if (parentForm) {
  const parentFormMessage = document.getElementById("parent-form-message");

  parentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    parentFormMessage.textContent = "";
    parentFormMessage.classList.remove("is-success", "is-error");
    parentForm.querySelectorAll(".field-error").forEach((message) => { message.textContent = ""; });
    parentForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    const values = readFormValues(parentForm);
    const validation = validateEntity("parent", values);
    if (!validation.isValid) {
      Object.entries(validation.errors).forEach(([name, message]) => {
        const field = parentForm.elements.namedItem(name);
        const fieldMessage = field?.closest("label")?.querySelector(".field-error");
        if (fieldMessage) fieldMessage.textContent = message;
        if (field && "setAttribute" in field) field.setAttribute("aria-invalid", "true");
      });
      parentFormMessage.textContent = "Перевірте позначені поля та виправте помилки.";
      parentFormMessage.classList.add("is-error");
      parentForm.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const parent = {
      id: generateUniqueId(parents),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      middleName: values.middleName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      relationship: values.relationship,
    };
    createRecord({
      entity: "parents", records: parents, record: parent, form: parentForm,
      tableId: "parents-table", tableColumns: columns.parents, message: parentFormMessage,
      successText: `Запис «${[parent.firstName, parent.middleName, parent.lastName].filter(Boolean).join(" ")}» збережено.`,
    });
  });
}

const campShiftForm = document.getElementById("camp-shift-form");
if (campShiftForm) {
  const campShiftFormMessage = document.getElementById("camp-shift-form-message");

  campShiftForm.addEventListener("submit", (event) => {
    event.preventDefault();
    campShiftFormMessage.textContent = "";
    campShiftFormMessage.classList.remove("is-success", "is-error");
    campShiftForm.querySelectorAll(".field-error").forEach((message) => { message.textContent = ""; });
    campShiftForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    const values = readFormValues(campShiftForm);
    const validation = validateEntity("campShift", values);
    if (!validation.isValid) {
      Object.entries(validation.errors).forEach(([name, message]) => {
        const field = campShiftForm.elements.namedItem(name);
        const fieldMessage = document.getElementById(`camp-shift-${name}-error`);
        if (fieldMessage) fieldMessage.textContent = message;
        if (field && "setAttribute" in field) field.setAttribute("aria-invalid", "true");
      });
      campShiftFormMessage.textContent = "Перевірте позначені поля та виправте помилки.";
      campShiftFormMessage.classList.add("is-error");
      campShiftForm.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const campShift = {
      id: generateUniqueId(campShifts),
      name: values.name.trim(),
      startDate: values.startDate,
      endDate: values.endDate,
      price: values.price,
      capacity: values.capacity,
      description: values.description.trim(),
    };
    createRecord({
      entity: "campShifts", records: campShifts, record: campShift, form: campShiftForm,
      tableId: "camp-shifts-table", tableColumns: columns.campShifts, message: campShiftFormMessage,
      successText: `Зміну «${campShift.name}» збережено.`,
    });
  });
}

const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  const bookingFormMessage = document.getElementById("booking-form-message");
  refreshBookingSelectors();

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingFormMessage.textContent = "";
    bookingFormMessage.classList.remove("is-success", "is-error");
    bookingForm.querySelectorAll(".field-error").forEach((message) => { message.textContent = ""; });
    bookingForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    const values = { ...readFormValues(bookingForm), createdAt: new Date().toISOString() };
    const validation = validateEntity("booking", values, { children, parents, campShifts });
    if (!validation.isValid) {
      Object.entries(validation.errors).forEach(([name, message]) => {
        const field = bookingForm.elements.namedItem(name);
        const fieldMessage = document.getElementById(`booking-${name}-error`);
        if (fieldMessage) fieldMessage.textContent = message;
        if (field && "setAttribute" in field) field.setAttribute("aria-invalid", "true");
      });
      bookingFormMessage.textContent = "Перевірте позначені поля та виправте помилки.";
      bookingFormMessage.classList.add("is-error");
      bookingForm.querySelector("[aria-invalid='true']")?.focus();
      return;
    }

    const booking = {
      id: generateUniqueId(bookings),
      parentId: findById(parents, values.parentId).id,
      childId: findById(children, values.childId).id,
      shiftId: findById(campShifts, values.shiftId).id,
      createdAt: values.createdAt,
      status: values.status,
      paymentStatus: values.paymentStatus,
      comment: values.comment.trim(),
    };
    createRecord({
      entity: "bookings", records: bookings, record: booking, form: bookingForm,
      tableId: "bookings-table", tableColumns: columns.bookings, message: bookingFormMessage,
      successText: "Бронювання збережено.",
    });
  });
}

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
