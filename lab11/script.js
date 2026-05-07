// Масив об'єктів студентів
const users  = [
  {
    name: "Крістіна",
    age: 19,
    grades: [85, 90, 92, 88],
    isStudent: true,
    colors: ["рожевий", "чорний", "білий"]
  },
  {
    name: "Діана",
    age: 18,
    grades: [100, 20, 68, 72],
    isStudent: true,
    colors: ["синій", "білий"]
  },
  {
    name: "Георгій",
    age: 22,
    grades: [40, 55, 50, 48],
    isStudent: false,
    colors: ["білий"]
  },
  {
    name: "Марія",
    age: 18,
    grades: [40, 55, 50, 48],
    isStudent: false,
    colors: ["синій", "білий"]
  },
  {
    name: "Ірина",
    age: 18,
    grades: [90, 100, 50, 48],
    isStudent: true,
    colors: ["рожевий"]
  },
  {
    name: "Анастасія",
    age: 19,
    grades: [90, 97, 88, 100],
    isStudent: true,
    colors: ["чорний", "білий"]
  }

];
const greetUser = (name) => `Привіт, ${name}!`;

const getAverage = (grades) => {
  let sum = 0;
  for (const grade of grades) {
    sum += grade;
  }
  return grades.length ? sum / grades.length : 0;
};

const getStatus = (average) =>
  average >= 90
    ? "Відмінно"
    : average >= 75
    ? "Добре"
    : average >= 60
    ? "Задовільно"
    : "Незадовільно";

console.log("=== ЗВІТ ПО СТУДЕНТАХ ===");

for (const user of users) {
  const greeting = greetUser(user.name);
  const avgGrade = getAverage(user.grades);
  const status = getStatus(avgGrade);
  const favColors = user.colors.join(", ");
  const studentInfo = user.isStudent ? "Діючий студент" : "Випускник/Гість";

  console.log(greeting);
  console.log(`Ім'я: ${user.name}`);
  console.log(`Вік: ${user.age}`);
  console.log(`Статус: ${studentInfo}`);
  console.log(`Улюблені кольори: ${favColors}`);
  console.log(`Середній бал: ${avgGrade.toFixed(1)} - ${status}`);
  console.log("-----------------------------");
}

// Завдання 3
const books = [
  {
    title: "Кобзар",
    author: "Тарас Шевченко",
    year: 1840,
    isRead: true
  },
  {
    title: "Лісова пісня",
    author: "Леся Українка",
    year: 1911,
    isRead: false
  },
  {
    title: "Тигролови",
    author: "Іван Багряний",
    year: 1944,
    isRead: true
  },
  {
    title: "Місто",
    author: "Валер'ян Підмогильний",
    year: 1928,
    isRead: false
  }
];

console.log("=== ТРЕКЕР ПРОЧИТАНИХ КНИГ ===");

for (const book of books) {
  const message = book.isRead
    ? `Вже прочитано: "${book.title}" автора ${book.author} (${book.year})`
    : `Слід прочитати: "${book.title}" автора ${book.author} (${book.year})`;

  console.log(message);
}

// Завдання 9 camelCase
const toCamelCase = (text) => {
  return text
    .split(/[\s_-]+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

console.log(toCamelCase("hello world"));        
console.log(toCamelCase("hello_world"));        
console.log(toCamelCase("hello-world"));        
console.log(toCamelCase("java script_language"));
console.log(toCamelCase("MY_TEXT-EXAMPLE"));   

// Завдання 12
const caesarCipher = (str, shift, decrypt = false) => {
  const alphabetLength = 26;
  let result = "";

  if (decrypt) {
    shift = -shift;
  }

  shift = ((shift % alphabetLength) + alphabetLength) % alphabetLength;

  for (const char of str) {
    const code = char.charCodeAt(0);

    // Великі літери A-Z
    if (code >= 65 && code <= 90) {
      const newCode = ((code - 65 + shift) % alphabetLength) + 65;
      result += String.fromCharCode(newCode);
    }
    // Малі літери a-z
    else if (code >= 97 && code <= 122) {
      const newCode = ((code - 97 + shift) % alphabetLength) + 97;
      result += String.fromCharCode(newCode);
    }
    // Пробіли, коми, крапки та інші символи не змінюємо
    else {
      result += char;
    }
  }

  return result;
};

// Перевірка
const encrypted1 = caesarCipher("Hello, World!", 3);
console.log("Шифрування:", encrypted1); // Khoor, Zruog!

const decrypted1 = caesarCipher(encrypted1, 3, true);
console.log("Дешифрування:", decrypted1); // Hello, World!

const encrypted2 = caesarCipher("JavaScript", 5);
console.log("Шифрування:", encrypted2);

const decrypted2 = caesarCipher(encrypted2, 5, true);
console.log("Дешифрування:", decrypted2);